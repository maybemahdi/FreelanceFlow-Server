import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FreelancerService } from "./freelancer.service";
import httpStatus from "http-status";

const getTotalClientsByFreelancer = catchAsync(async (req, res) => {
  const result = await FreelancerService.getTotalClientsByFreelancer(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Clients retrieved successfully",
    data: result,
  });
});

const getTotalProjectsByFreelancer = catchAsync(async (req, res) => {
  const result = await FreelancerService.getTotalProjectsByFreelancer(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getDueSoonRemindersByFreelancer = catchAsync(async (req, res) => {
  const result = await FreelancerService.getDueSoonRemindersByFreelancer(
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Due soon reminders retrieved successfully",
    data: result,
  });
});

export const FreelancerController = {
  getTotalClientsByFreelancer,
  getTotalProjectsByFreelancer,
  getDueSoonRemindersByFreelancer,
};
