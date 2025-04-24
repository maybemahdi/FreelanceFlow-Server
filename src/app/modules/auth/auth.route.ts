import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  forgetPasswordValidationSchema,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidationSchema,
} from "./auth.validation";
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
AuthRoutes.post("/refresh-token", AuthController.refreshToken);
AuthRoutes.post(
  "/forget-password",
  validateRequest(forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);
AuthRoutes.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  AuthController.resetPassword,
);
AuthRoutes.post(
  "/change-password",
  auth(UserRole.FREELANCER, UserRole.ADMIN),
  AuthController.changePassword,
);

export default AuthRoutes;
