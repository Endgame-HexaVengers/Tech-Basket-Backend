import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { InventoryServices } from "./inventory.services.js";

const getInventory = catchAsync(async (req: Request, res: Response) => {
  const { inventory, pagination } = await InventoryServices.getInventory(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Inventory retrieved successfully",
    data: inventory,
    pagination,
  });
});

const getInventoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await InventoryServices.getInventoryById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Inventory record found" : "Inventory record not found",
    data: result,
  });
});

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await InventoryServices.updateInventory(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Inventory updated successfully" : "Inventory record not found",
    data: result,
  });
});

const getSerialNumbers = catchAsync(async (req: Request, res: Response) => {
  const { serials, pagination } = await InventoryServices.getSerialNumbers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Serial numbers retrieved successfully",
    data: serials,
    pagination,
  });
});

const getSerialNumberByCode = catchAsync(async (req: Request, res: Response) => {
  const code = req.params.code as string;
  const result = await InventoryServices.getSerialNumberByCode(code);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Serial number details found" : "Serial number not found",
    data: result,
  });
});

export const InventoryControllers = {
  getInventory,
  getInventoryById,
  updateInventory,
  getSerialNumbers,
  getSerialNumberByCode,
};
