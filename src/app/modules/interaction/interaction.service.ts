import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { dateHelpers } from "../../../helpers/dateHelpers";
import {
  ICreateInteraction,
  IUpdateInteraction,
} from "./interaction.interface";

// Create Interaction
const createInteraction = async (
  payload: ICreateInteraction,
  decodedUser: JwtPayload,
) => {
  // Validate client ownership
  const isClientValid = await prisma.client.findUnique({
    where: {
      id: payload.clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  // Validate project ownership and relation to client
  const isProjectValid = await prisma.project.findUnique({
    where: {
      id: payload.projectId,
      clientId: payload.clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectValid) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Project not found or doesn't belong to client",
    );
  }

  const result = await prisma.interaction.create({
    data: {
      ...payload,
      date: dateHelpers.convertToISO(payload.date),
      ownerId: decodedUser.id,
    },
  });

  return result;
};

// Update Interaction
const updateInteraction = async (
  id: string,
  payload: IUpdateInteraction,
  decodedUser: JwtPayload,
) => {
  // Check if interaction exists and belongs to user
  const existingInteraction = await prisma.interaction.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
    },
  });
  if (!existingInteraction) {
    throw new AppError(httpStatus.NOT_FOUND, "Interaction not found");
  }

  // Validate client if being updated
  if (payload.clientId) {
    const isClientValid = await prisma.client.findUnique({
      where: {
        id: payload.clientId,
        ownerId: decodedUser.id,
      },
    });
    if (!isClientValid) {
      throw new AppError(httpStatus.NOT_FOUND, "Client not found");
    }
  }

  // Validate project if being updated
  if (payload.projectId) {
    const clientId = payload.clientId || existingInteraction.clientId;
    const isProjectValid = await prisma.project.findUnique({
      where: {
        id: payload.projectId,
        clientId,
        ownerId: decodedUser.id,
      },
    });
    if (!isProjectValid) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Project not found or doesn't belong to client",
      );
    }
  }

  const updateData = { ...payload };
  if (payload.date) {
    updateData.date = dateHelpers.convertToISO(payload.date);
  }

  const result = await prisma.interaction.update({
    where: { id },
    data: updateData,
  });

  return result;
};

// Delete Interaction (soft delete)
const deleteInteraction = async (id: string, decodedUser: JwtPayload) => {
  const existingInteraction = await prisma.interaction.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
  });
  if (!existingInteraction) {
    throw new AppError(httpStatus.NOT_FOUND, "Interaction not found");
  }

  const result = await prisma.interaction.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

// Get all interactions for a project
const getProjectInteractions = async (
  projectId: string,
  decodedUser: JwtPayload,
) => {
  const isProjectValid = await prisma.project.findUnique({
    where: {
      id: projectId,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const interactions = await prisma.interaction.findMany({
    where: {
      projectId,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
    orderBy: {
      date: "desc",
    },
  });

  return interactions;
};

// Get all interactions for a client
const getClientInteractions = async (
  clientId: string,
  decodedUser: JwtPayload,
) => {
  const isClientValid = await prisma.client.findUnique({
    where: {
      id: clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const interactions = await prisma.interaction.findMany({
    where: {
      clientId,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
    orderBy: {
      date: "desc",
    },
  });

  return interactions;
};

// Get single interaction
const getSingleInteraction = async (id: string, decodedUser: JwtPayload) => {
  const interaction = await prisma.interaction.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
    },
  });
  if (!interaction) {
    throw new AppError(httpStatus.NOT_FOUND, "Interaction not found");
  }

  return interaction;
};

export const InteractionService = {
  createInteraction,
  updateInteraction,
  deleteInteraction,
  getProjectInteractions,
  getClientInteractions,
  getSingleInteraction,
};
