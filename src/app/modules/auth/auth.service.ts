/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import isUserExistsByEmail from "../../utils/isUserExistsByEmail";
import isPasswordMatched from "../../utils/isPasswordMatched";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import { sendEmail } from "../../utils/sendEmail";
import { JwtPayload, Secret } from "jsonwebtoken";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const user = await isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, "User Already Exists");
  }
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

  const html = `
  <html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our Platform!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table align="center" width="600" style="background: white; padding: 20px; border-radius: 10px;">
    <tr>
      <td align="center">
        <h2 style="color: #333;">Welcome to Our Platform, ${result?.name}! 🎉</h2>
        <p>We are excited to have you on board. You can now explore and enjoy our services.</p>
        <p>Need help? <a href=${`mailto:${config.email}`} style="color:rgb(0, 0, 0);">Contact Support</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  sendEmail("Welcome Onboard", result?.email, html);

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
    config.jwt.jwt_access_secret as Secret,
    config.jwt.jwt_access_expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as Secret,
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
    config.jwt.jwt_access_secret as Secret,
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

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await isUserExistsByEmail(email);

  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string,
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #000;
        }
        .message {
            font-size: 16px;
            color: #333;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background: #000;
            color: #ffffff !important;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            transition: 0.3s;
        }
        .btn:hover {
            background: #000;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="logo">FreelanceFlow</div>
        <p class="message">We received a request to reset your password. Click the button below to set a new password.</p>
        <a href=${resetUILink} target="_blank" class="btn">Reset Password</a>
        <p class="message">The Link will be valid for 10 minutes.</p>
        <p class="message">If you didn't request this, you can ignore this email.</p>
        <p class="footer">&copy; ${new Date().getFullYear()} FreelanceFlow. All rights reserved.</p>
    </div>
  </body>
 </html>
  `;

  sendEmail("Reset your password", user?.email, html);
  return {
    resetToken: resetToken,
  };
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the given token is valid
  let decoded: JwtPayload = {} as JwtPayload;
  try {
    decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret,
    );
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(httpStatus.FORBIDDEN, "Token is expired!");
    }
    throw new AppError(httpStatus.FORBIDDEN, "Try again");
  }

  // checking if the user is exist
  const user = await isUserExistsByEmail(payload?.email);

  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (payload?.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized Attempt!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      email: decoded.email,
      role: decoded.role,
    },
    data: {
      password: newHashedPassword,
    },
  });
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

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
