import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import isUserExistsById from "../../utils/isUserExistById";
import { ICreateClient } from "./client.interface";
import httpStatus from "http-status";

const createClient = async (payload: ICreateClient) => {
  const isClientExistByFreelancer = await prisma.client.findFirst({
    where: {
      email: payload.email,
      ownerId: payload.ownerId,
    },
  });

  if (isClientExistByFreelancer) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Client with this email already exists for the given owner.",
    );
  }

  const isOwnerExists = await isUserExistsById(payload.ownerId);

  if (!isOwnerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner doesn't exist");
  }

  return await prisma.client.create({
    data: payload,
  });
};

export const ClientService = {
  createClient,
};
