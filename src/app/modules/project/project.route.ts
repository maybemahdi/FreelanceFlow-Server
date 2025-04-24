import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const ProjectRoutes = Router();

ProjectRoutes.post("/", auth(UserRole.FREELANCER),);

export default ProjectRoutes;
