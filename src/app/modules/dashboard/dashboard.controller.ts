import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { DashboardServices } from "./dashboard.services.js";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const branchId = (req.query.branch as string) || req.user?.branch;
  const result = await DashboardServices.getDashboardStats(branchId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard statistics calculated successfully",
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardStats,
};
