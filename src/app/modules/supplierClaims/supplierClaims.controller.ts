import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { SupplierClaimServices } from "./supplierClaims.services.js";

const createClaim = catchAsync(async (req: Request, res: Response) => {
  const result = await SupplierClaimServices.createClaim(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Supplier claim registered",
    data: result,
  });
});

const getClaims = catchAsync(async (req: Request, res: Response) => {
  const { claims, pagination } = await SupplierClaimServices.getClaims(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Supplier claims retrieved",
    data: claims,
    pagination,
  });
});

const getClaimById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SupplierClaimServices.getClaimById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Supplier claim found" : "Supplier claim not found",
    data: result,
  });
});

const updateClaim = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SupplierClaimServices.updateClaim(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Supplier claim updated",
    data: result,
  });
});

export const SupplierClaimControllers = {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
};
