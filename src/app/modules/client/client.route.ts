import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ClientController } from "./client.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  createClientZodSchema,
  updateClientZodSchema,
} from "./client.validation";

const ClientRoutes = Router();

ClientRoutes.post(
  "/",
  auth(UserRole.FREELANCER),
  validateRequest(createClientZodSchema),
  ClientController.createClient,
);
ClientRoutes.patch(
  "/:id",
  auth(UserRole.FREELANCER),
  validateRequest(updateClientZodSchema),
  ClientController.updateClient,
);
ClientRoutes.get("/", auth(UserRole.FREELANCER), ClientController.getMyClients);
ClientRoutes.get(
  "/:id",
  auth(UserRole.FREELANCER),
  ClientController.getSingleClientForFreelancer,
);
ClientRoutes.delete(
  "/:id",
  auth(UserRole.FREELANCER),
  ClientController.deleteClientForFreelancer,
);

export default ClientRoutes;
