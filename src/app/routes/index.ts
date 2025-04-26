import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import UserRoutes from "../modules/user/user.route";
import ClientRoutes from "../modules/client/client.route";
import ProjectRoutes from "../modules/project/project.route";
import FreelancerRoutes from "../modules/freelancer/freelancer.route";
import InteractionRoutes from "../modules/interaction/interaction.route";
import ReminderRoutes from "../modules/reminder/reminder.route";

const router = Router();
const routes = [
  {
    path: "/auth",
    destination: AuthRoutes,
  },
  {
    path: "/user",
    destination: UserRoutes,
  },
  {
    path: "/client",
    destination: ClientRoutes,
  },
  {
    path: "/project",
    destination: ProjectRoutes,
  },
  {
    path: "/freelancer",
    destination: FreelancerRoutes,
  },
  {
    path: "/interaction",
    destination: InteractionRoutes,
  },
  {
    path: "/reminder",
    destination: ReminderRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
