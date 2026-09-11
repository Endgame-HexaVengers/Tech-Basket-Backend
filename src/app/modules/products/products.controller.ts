import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { ProductServices } from "./products.services.js";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { products, pagination } = await ProductServices.getProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieved successfully",
    data: products,
    pagination,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductServices.getProductById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Product retrieved successfully" : "Product not found",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductServices.updateProduct(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Product updated successfully" : "Product not found",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductServices.deleteProduct(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Product deleted successfully" : "Product not found",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};