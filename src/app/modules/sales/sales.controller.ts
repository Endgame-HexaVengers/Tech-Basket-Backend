import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { SaleServices } from "./sales.services.js";

const createSale = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.soldBy;
  const userBranch = req.user?.branch || req.body.branch;

  const result = await SaleServices.createSale({
    ...req.body,
    soldBy: userId,
    branch: req.body.branch || userBranch,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sale completed and invoice generated successfully",
    data: result,
  });
});

const getSales = catchAsync(async (req: Request, res: Response) => {
  const { sales, pagination } = await SaleServices.getSales(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sales retrieved successfully",
    data: sales,
    pagination,
  });
});

const getSaleById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SaleServices.getSaleById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Sale found" : "Sale not found",
    data: result,
  });
});

const getSaleByInvoice = catchAsync(async (req: Request, res: Response) => {
  const invoiceNumber = req.params.invoice as string;
  const result = await SaleServices.getSaleByInvoice(invoiceNumber);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Sale invoice found" : "Sale invoice not found",
    data: result,
  });
});

export const SaleControllers = {
  createSale,
  getSales,
  getSaleById,
  getSaleByInvoice,
};
