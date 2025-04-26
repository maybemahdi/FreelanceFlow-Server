import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ReminderController } from "./reminder.controller";
import { UserRole } from "@prisma/client";
import {
  createReminderValidationSchema,
  updateReminderValidationSchema,
} from "./reminder.validation";

const ReminderRoutes = Router();

ReminderRoutes.post(
  "/",
  auth(UserRole.FREELANCER),
  validateRequest(createReminderValidationSchema),
  ReminderController.createReminder,
);
ReminderRoutes.patch(
  "/:id",
  auth(UserRole.FREELANCER),
  validateRequest(updateReminderValidationSchema),
  ReminderController.updateReminder,
);
ReminderRoutes.delete(
  "/:id",
  auth(UserRole.FREELANCER),
  ReminderController.deleteReminder,
);
ReminderRoutes.get(
  "/get-upcoming-reminders",
  auth(UserRole.FREELANCER),
  ReminderController.getUpcomingReminders,
);
ReminderRoutes.get(
  "/get-reminders-by-client/:clientId",
  auth(UserRole.FREELANCER),
  ReminderController.getClientReminders,
);
ReminderRoutes.get(
  "/get-reminders-by-project/:projectId",
  auth(UserRole.FREELANCER),
  ReminderController.getProjectReminders,
);
ReminderRoutes.get(
  "/get-single-reminder/:id",
  auth(UserRole.FREELANCER),
  ReminderController.getSingleReminder,
);

export default ReminderRoutes;
