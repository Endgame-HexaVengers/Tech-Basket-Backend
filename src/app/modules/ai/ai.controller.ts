import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AIServices } from "./ai.services.js";

const getDemandForecast = catchAsync(async (_req: Request, res: Response) => {
  const result = await AIServices.getDemandForecast();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Demand forecast generated",
    data: result,
  });
});

const getLowStockPrediction = catchAsync(async (_req: Request, res: Response) => {
  const result = await AIServices.getLowStockPrediction();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Low stock predictions calculated",
    data: result,
  });
});

const getRestockRecommendations = catchAsync(async (_req: Request, res: Response) => {
  const result = await AIServices.getRestockRecommendations();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restock recommendations prepared",
    data: result,
  });
});

const getRMATrends = catchAsync(async (_req: Request, res: Response) => {
  const result = await AIServices.getRMATrends();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "RMA trend analysis generated",
    data: result,
  });
});

const getSupplierPerformance = catchAsync(async (_req: Request, res: Response) => {
  const result = await AIServices.getSupplierPerformance();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Supplier performance scores calculated",
    data: result,
  });
});

export const AIControllers = {
  getDemandForecast,
  getLowStockPrediction,
  getRestockRecommendations,
  getRMATrends,
  getSupplierPerformance,
};
