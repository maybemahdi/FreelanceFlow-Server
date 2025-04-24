import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ClientController } from "./client.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createClientZodSchema } from "./client.validation";

const ClientRoutes = Router();

ClientRoutes.post(
  "/",
  auth(UserRole.FREELANCER),
  validateRequest(createClientZodSchema),
  ClientController.createClient,
);

export default ClientRoutes;
