import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ProjectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  createProjectValidationSchema,
  updateProjectStatusValidationSchema,
  updateProjectValidationSchema,
} from "./project.validation";

const ProjectRoutes = Router();

ProjectRoutes.post(
  "/",
  auth(UserRole.FREELANCER),
  validateRequest(createProjectValidationSchema),
  ProjectController.createProject,
);
ProjectRoutes.patch(
  "/:id",
  auth(UserRole.FREELANCER),
  validateRequest(updateProjectValidationSchema),
  ProjectController.updateProject,
);
ProjectRoutes.patch(
  "/update-project-status/:id",
  auth(UserRole.FREELANCER),
  validateRequest(updateProjectStatusValidationSchema),
  ProjectController.updateProjectStatus,
);
ProjectRoutes.delete(
  "/:id",
  auth(UserRole.FREELANCER),
  ProjectController.deleteProject,
);
ProjectRoutes.get(
  "/get-all-project-by-client/:id",
  auth(UserRole.FREELANCER),
  ProjectController.getAllProjectByClient,
);
ProjectRoutes.get(
  "/get-all-project-by-freelancer",
  auth(UserRole.FREELANCER),
  ProjectController.getAllProjectByFreelancer,
);
ProjectRoutes.get(
  "/get-single-project-by-freelancer/:id",
  auth(UserRole.FREELANCER),
  ProjectController.getSingleProjectByFreelancer,
);

export default ProjectRoutes;
