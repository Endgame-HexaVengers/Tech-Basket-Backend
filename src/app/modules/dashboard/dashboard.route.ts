import { Router } from "express";
import { DashboardControllers } from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", DashboardControllers.getDashboardStats);

export default dashboardRouter;
