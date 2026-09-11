import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { WarrantyServices } from "./warranties.services.js";

const createWarranty = catchAsync(async (req: Request, res: Response) => {
  const result = await WarrantyServices.createWarranty(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Warranty created successfully",
    data: result,
  });
});

const getWarranties = catchAsync(async (req: Request, res: Response) => {
  const { warranties, pagination } = await WarrantyServices.getWarranties(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Warranties retrieved successfully",
    data: warranties,
    pagination,
  });
});

const getWarrantyBySerial = catchAsync(async (req: Request, res: Response) => {
  const serial = req.params.serial as string;
  const result = await WarrantyServices.getWarrantyBySerial(serial);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Warranty record found" : "No warranty found for this serial number",
    data: result,
  });
});

const getWarrantyById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await WarrantyServices.getWarrantyById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Warranty found" : "Warranty not found",
    data: result,
  });
});

export const WarrantyControllers = {
  createWarranty,
  getWarranties,
  getWarrantyBySerial,
  getWarrantyById,
};
