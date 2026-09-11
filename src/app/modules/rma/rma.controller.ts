import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { RMAServices } from "./rma.services.js";

const createRMA = catchAsync(async (req: Request, res: Response) => {
  const result = await RMAServices.createRMA(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "RMA ticket created successfully",
    data: result,
  });
});

const getRMAs = catchAsync(async (req: Request, res: Response) => {
  const { rmas, pagination } = await RMAServices.getRMAs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "RMA tickets retrieved successfully",
    data: rmas,
    pagination,
  });
});

const getRMAById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await RMAServices.getRMAById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "RMA ticket found" : "RMA ticket not found",
    data: result,
  });
});

const updateRMA = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await RMAServices.updateRMA(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "RMA ticket updated successfully",
    data: result,
  });
});

export const RMAControllers = {
  createRMA,
  getRMAs,
  getRMAById,
  updateRMA,
};
