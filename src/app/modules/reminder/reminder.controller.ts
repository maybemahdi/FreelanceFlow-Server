import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReminderService } from "./reminder.service";
import httpStatus from "http-status";

const createReminder = catchAsync(async (req, res) => {
  const result = await ReminderService.createReminder(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Reminder created successfully",
    data: result,
  });
});

const updateReminder = catchAsync(async (req, res) => {
  const result = await ReminderService.updateReminder(
    req.params.id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reminder updated successfully",
    data: result,
  });
});

const deleteReminder = catchAsync(async (req, res) => {
  const result = await ReminderService.deleteReminder(req.params.id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reminder deleted successfully",
    data: result,
  });
});

const getUpcomingReminders = catchAsync(async (req, res) => {
  const result = await ReminderService.getUpcomingReminders(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upcoming reminders retrieved successfully",
    data: result,
  });
});

const getClientReminders = catchAsync(async (req, res) => {
  const result = await ReminderService.getClientReminders(
    req.params.clientId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client reminders retrieved successfully",
    data: result,
  });
});

const getProjectReminders = catchAsync(async (req, res) => {
  const result = await ReminderService.getProjectReminders(
    req.params.projectId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project reminders retrieved successfully",
    data: result,
  });
});

const getSingleReminder = catchAsync(async (req, res) => {
  const result = await ReminderService.getSingleReminder(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reminder retrieved successfully",
    data: result,
  });
});

export const ReminderController = {
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  getClientReminders,
  getProjectReminders,
  getSingleReminder,
};
