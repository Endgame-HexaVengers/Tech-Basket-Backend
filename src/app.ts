import cors from "cors";
import express, { type Request, type Response } from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import router from "./app/modules/routes/index.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Tech-Basket Backend API v1",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1", router);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;