import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { InteractionController } from "./interaction.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  createInteractionValidationSchema,
  updateInteractionValidationSchema,
} from "./interaction.validation";

const InteractionRoutes = Router();

InteractionRoutes.post(
  "/",
  auth(UserRole.FREELANCER),
  validateRequest(createInteractionValidationSchema),
  InteractionController.createInteraction,
);
InteractionRoutes.patch(
  "/:id",
  auth(UserRole.FREELANCER),
  validateRequest(updateInteractionValidationSchema),
  InteractionController.updateInteraction,
);
InteractionRoutes.delete(
  "/:id",
  auth(UserRole.FREELANCER),
  InteractionController.deleteInteraction,
);
InteractionRoutes.get(
  "/get-interaction-by-project/:projectId",
  auth(UserRole.FREELANCER),
  InteractionController.getProjectInteractions,
);
InteractionRoutes.get(
  "/get-interaction-by-client/:clientId",
  auth(UserRole.FREELANCER),
  InteractionController.getClientInteractions,
);
InteractionRoutes.get(
  "/get-single-interaction/:id",
  auth(UserRole.FREELANCER),
  InteractionController.getSingleInteraction,
);

export default InteractionRoutes;
