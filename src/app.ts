import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";

const app: Application = express();

// middlewares and parser
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://freelance-flow-frontend.vercel.app",
    ], // Allow requests from your Vite app
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods if necessary
    credentials: true, // If you're using cookies or HTTP authentication
  }),
);
app.use(cookieParser());

// get started
const getRoot = (req: Request, res: Response) => {
  res.json({ message: "App is running" });
};
app.get("/", getRoot);

// application routes
app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
