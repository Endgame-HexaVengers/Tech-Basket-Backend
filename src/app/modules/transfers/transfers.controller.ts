import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { TransferServices } from "./transfers.services.js";

const createTransfer = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.requestedBy;
  const result = await TransferServices.createTransfer({
    ...req.body,
    requestedBy: userId,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Stock transfer request created",
    data: result,
  });
});

const getTransfers = catchAsync(async (req: Request, res: Response) => {
  const { transfers, pagination } = await TransferServices.getTransfers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock transfers retrieved",
    data: transfers,
    pagination,
  });
});

const getTransferById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TransferServices.getTransferById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Stock transfer found" : "Stock transfer not found",
    data: result,
  });
});

const approveTransfer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id || req.body.approvedBy;
  const result = await TransferServices.approveTransfer(id, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock transfer approved",
    data: result,
  });
});

const shipTransfer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TransferServices.shipTransfer(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock transfer marked as shipped",
    data: result,
  });
});

const receiveTransfer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id || req.body.receivedBy;
  const result = await TransferServices.receiveTransfer(id, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock transfer received and inventory updated",
    data: result,
  });
});

const getStockMovements = catchAsync(async (req: Request, res: Response) => {
  const { movements, pagination } = await TransferServices.getStockMovements(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock movements retrieved",
    data: movements,
    pagination,
  });
});

export const TransferControllers = {
  createTransfer,
  getTransfers,
  getTransferById,
  approveTransfer,
  shipTransfer,
  receiveTransfer,
  getStockMovements,
};
