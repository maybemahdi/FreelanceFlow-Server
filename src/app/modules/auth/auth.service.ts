/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import isUserExistsByEmail from "../../utils/isUserExistByEmail";
import isPasswordMatched from "../../utils/isPasswordMatched";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return {
    id: result?.id,
    name: result?.name,
    email: result?.email,
  };
};

const loginUser = async (payload: ILoginUser) => {
  // checking if the user exists
  const user = await isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // checking if the user is blocked
  const isBlocked = user?.status === UserStatus.BLOCKED;

  if (isBlocked) {
    throw new AppError(httpStatus.UNAUTHORIZED, "This user is blocked!");
  }

  // checking if the password is correct
  if (!(await isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // create token and send to the client
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as string,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expires_in as string,
  );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as string,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_refresh_secret as string,
    );
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as string,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as string,
    accessToken,
  };
};

const changePassword = async (
  payload: {
    currentPassword: string;
    newPassword: string;
  },
  user: any,
) => {
  const { currentPassword, newPassword } = payload;

  const userForCheck = await prisma.user.findUniqueOrThrow({
    where: { id: user?.id },
  });

  // Check if the current password matches
  if (!userForCheck?.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password not found");
  }

  if (!(await isPasswordMatched(currentPassword, userForCheck.password))) {
    return {
      success: false,
      message: "Current password is incorrect",
    };
  }

  // Update the password
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

const updateUserStatus = async (payload: {
  id: string;
  status: UserStatus;
}) => {
  const result = await prisma.user.update({
    where: { id: payload.id },
    data: { status: payload.status },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Something went wrong!");
  }

  return result;
};

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  changePassword,
  updateUserStatus,
};
