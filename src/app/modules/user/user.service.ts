import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

const updateUserStatus = async (
  payload: {
    id: string;
    status: UserStatus;
  },
  decodedUser: JwtPayload,
) => {
  const isAdminWantsToChangeHisStatus = payload.id === decodedUser.id;
  if (isAdminWantsToChangeHisStatus) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "You cant change your status");
  }

  const result = await prisma.user.update({
    where: { id: payload.id },
    data: { status: payload.status },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Something went wrong!");
  }

  return result;
};

export const UserService = {
  updateUserStatus,
};
