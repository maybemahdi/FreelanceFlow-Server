import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { FreelancerController } from "./freelancer.controller";

const FreelancerRoutes = Router();

FreelancerRoutes.get(
  "/get-total-clients-by-freelancer",
  auth(UserRole.FREELANCER),
  FreelancerController.getTotalClientsByFreelancer,
);

FreelancerRoutes.get(
  "/get-total-projects-by-freelancer",
  auth(UserRole.FREELANCER),
  FreelancerController.getTotalProjectsByFreelancer,
);

FreelancerRoutes.get(
  "/get-due-soon-reminders-by-freelancer",
  auth(UserRole.FREELANCER),
  FreelancerController.getDueSoonRemindersByFreelancer,
);

export default FreelancerRoutes;
