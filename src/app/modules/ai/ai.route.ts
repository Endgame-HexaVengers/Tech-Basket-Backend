import { Router } from "express";
import { AIControllers } from "./ai.controller.js";

const aiRouter = Router();

aiRouter.get("/demand-forecast", AIControllers.getDemandForecast);
aiRouter.get("/low-stock-prediction", AIControllers.getLowStockPrediction);
aiRouter.get("/restock-recommendations", AIControllers.getRestockRecommendations);
aiRouter.get("/rma-trends", AIControllers.getRMATrends);
aiRouter.get("/supplier-performance", AIControllers.getSupplierPerformance);

export default aiRouter;
