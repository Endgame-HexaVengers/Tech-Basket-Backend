import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { PurchaseServices } from "./purchases.services.js";

const createPurchase = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.receivedBy;
  const result = await PurchaseServices.createPurchase({
    ...req.body,
    receivedBy: userId,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Purchase order created and inventory updated successfully",
    data: result,
  });
});

const getPurchases = catchAsync(async (req: Request, res: Response) => {
  const { purchases, pagination } = await PurchaseServices.getPurchases(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Purchases retrieved successfully",
    data: purchases,
    pagination,
  });
});

const getPurchaseById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await PurchaseServices.getPurchaseById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Purchase order found" : "Purchase order not found",
    data: result,
  });
});

export const PurchaseControllers = {
  createPurchase,
  getPurchases,
  getPurchaseById,
};
