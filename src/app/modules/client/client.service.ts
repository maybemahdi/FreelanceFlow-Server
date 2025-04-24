import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import isUserExistsById from "../../utils/isUserExistById";
import { ICreateClient } from "./client.interface";
import httpStatus from "http-status";

const createClient = async (
  payload: ICreateClient,
  decodedUser: JwtPayload,
) => {
  const isClientExistByFreelancer = await prisma.client.findFirst({
    where: {
      email: payload.email,
      ownerId: decodedUser.id,
    },
  });

  if (isClientExistByFreelancer) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Client with this email already exists for the given owner.",
    );
  }

  const isOwnerExists = await isUserExistsById(decodedUser.id);

  if (!isOwnerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner doesn't exist");
  }

  return await prisma.client.create({
    data: { ...payload, ownerId: decodedUser.id },
  });
};

const updateClient = async (
  id: string,
  payload: Partial<ICreateClient>,
  decodedUser: JwtPayload,
) => {
  const isClientExists = await prisma.client.findFirst({
    where: {
      id: id,
    },
  });

  if (!isClientExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Client doesn't exist");
  }
  const isClientOwnedByFreelancer = await prisma.client.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientOwnedByFreelancer) {
    throw new AppError(httpStatus.FORBIDDEN, "Your don't own the client!");
  }
  const result = await prisma.client.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const getMyClients = async (decodedUser: JwtPayload) => {
  const isUserWhoRequestedExists = await isUserExistsById(decodedUser.id);
  if (!isUserWhoRequestedExists) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User who requested doesn't exist",
    );
  }
  const result = await prisma.client.findMany({
    where: {
      ownerId: decodedUser.id,
      isDeleted: false,
    },
  });
  return result;
};

const getSingleClientForFreelancer = async (
  id: string,
  decodedUser: JwtPayload,
) => {
  const isUserWhoRequestedExists = await isUserExistsById(decodedUser.id);
  if (!isUserWhoRequestedExists) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User who requested doesn't exist",
    );
  }
  const result = await prisma.client.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  return result;
};

const deleteClientForFreelancer = async (
  id: string,
  decodedUser: JwtPayload,
) => {
  const isUserWhoRequestedExists = await isUserExistsById(decodedUser.id);
  if (!isUserWhoRequestedExists) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User who requested doesn't exist",
    );
  }
  const isClientExists = await prisma.client.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
  });

  if (!isClientExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  await prisma.client.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return null;
};

export const ClientService = {
  createClient,
  updateClient,
  getMyClients,
  getSingleClientForFreelancer,
  deleteClientForFreelancer,
};
