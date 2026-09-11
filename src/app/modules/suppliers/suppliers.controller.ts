import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { SupplierServices } from "./suppliers.services.js";

const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const result = await SupplierServices.createSupplier(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Supplier created successfully",
    data: result,
  });
});

const getSuppliers = catchAsync(async (req: Request, res: Response) => {
  const { suppliers, pagination } = await SupplierServices.getSuppliers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Suppliers retrieved successfully",
    data: suppliers,
    pagination,
  });
});

const getSupplierById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SupplierServices.getSupplierById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Supplier retrieved successfully" : "Supplier not found",
    data: result,
  });
});

const updateSupplier = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SupplierServices.updateSupplier(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Supplier updated successfully" : "Supplier not found",
    data: result,
  });
});

const deleteSupplier = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SupplierServices.deleteSupplier(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Supplier deleted successfully" : "Supplier not found",
    data: result,
  });
});

export const SupplierControllers = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
