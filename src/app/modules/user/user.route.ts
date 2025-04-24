import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { updateUserStatusValidation } from "./user.validation";

const UserRoutes = Router();

UserRoutes.patch(
  "/update-user-status",
  auth(UserRole.ADMIN),
  validateRequest(updateUserStatusValidation),
  UserController.updateUserStatus,
);

export default UserRoutes;
