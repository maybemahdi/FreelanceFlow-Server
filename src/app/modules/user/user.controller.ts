import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await UserService.updateUserStatus(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User status changed successfully`,
    data: result,
  });
});

export const UserController = {
  updateUserStatus,
};