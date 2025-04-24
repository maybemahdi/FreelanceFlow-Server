import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { loginUserValidation, registerUserValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";

const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(registerUserValidation),
  AuthController.registerUser,
);
AuthRoutes.post(
  "/login",
  validateRequest(loginUserValidation),
  AuthController.loginUser,
);
AuthRoutes.post(
  "/change-password",
  auth(UserRole.FREELANCER, UserRole.ADMIN),
  AuthController.changePassword,
);
AuthRoutes.patch(
  "/update-user-status",
  auth(UserRole.ADMIN),
  AuthController.updateUserStatus,
);

export default AuthRoutes;
