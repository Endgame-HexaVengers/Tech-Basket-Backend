import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { BrandServices } from "./brands.services.js";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandServices.createBrand(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandServices.getBrands(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brands retrieved successfully",
    data: result,
  });
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BrandServices.getBrandById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Brand retrieved successfully" : "Brand not found",
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BrandServices.updateBrand(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Brand updated successfully" : "Brand not found",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BrandServices.deleteBrand(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Brand deleted successfully" : "Brand not found",
    data: result,
  });
});

export const BrandControllers = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
