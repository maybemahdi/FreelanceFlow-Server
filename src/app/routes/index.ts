import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import UserRoutes from "../modules/user/user.route";
import ClientRoutes from "../modules/client/client.route";

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
];

routes.forEach((route) => router.use(route.path, route.destination));
export default router;
