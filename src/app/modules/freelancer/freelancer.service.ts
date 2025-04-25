import { JwtPayload } from "jsonwebtoken";
import isUserExistsById from "../../utils/isUserExistById";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getTotalClientsByFreelancer = async (decodedUser: JwtPayload) => {
  const isFreelancerExists = await isUserExistsById(decodedUser.id);
  if (!isFreelancerExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Freelancer who requested doesn't exist",
    );
  }
  const result = await prisma.client.count({
    where: {
      ownerId: decodedUser.id,
    },
  });
  return { count: result };
};

const getTotalProjectsByFreelancer = async (decodedUser: JwtPayload) => {
  const isFreelancerExists = await isUserExistsById(decodedUser.id);
  if (!isFreelancerExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Freelancer who requested doesn't exist",
    );
  }
  const result = await prisma.project.count({
    where: {
      ownerId: decodedUser.id,
    },
  });
  return { count: result };
};

const getDueSoonRemindersByFreelancer = async (decodedUser: JwtPayload) => {
  const isFreelancerExists = await isUserExistsById(decodedUser.id);
  if (!isFreelancerExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Freelancer who requested doesn't exist",
    );
  }
  const result = await prisma.reminder.findMany({
    where: {
      date: {
        gte: new Date(),
        lte: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      ownerId: decodedUser.id,
    },
  });
  return result;
};

export const FreelancerService = {
  getTotalClientsByFreelancer,
  getTotalProjectsByFreelancer,
  getDueSoonRemindersByFreelancer,
};
