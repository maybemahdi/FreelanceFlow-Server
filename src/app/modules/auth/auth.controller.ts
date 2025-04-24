import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserIntoDB(req?.body);
  sendResponse(res, {
    success: true,
    message: "User registered successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, id, name, email, role, accessToken } = result;

  // Expire the previous token if it exists
  if (req.cookies.token) {
    res.clearCookie("token");
  }

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      id,
      name,
      email,
      role,
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  const { id, name, email, role, accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token Refreshed!",
    data: {
      id,
      name,
      email,
      role,
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.body, req.user);
  sendResponse(res, {
    success: result?.success,
    statusCode: httpStatus.OK,
    message: result?.message,
    data: null,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await AuthService.updateUserStatus(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User status changed successfully`,
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  updateUserStatus,
};
