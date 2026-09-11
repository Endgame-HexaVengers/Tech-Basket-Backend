import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { RMAReplacementServices } from "./rmaReplacements.services.js";

const createReplacement = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.processedBy;
  const result = await RMAReplacementServices.createReplacement({
    ...req.body,
    processedBy: userId,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "RMA serial replacement processed and recorded",
    data: result,
  });
});

const getReplacements = catchAsync(async (req: Request, res: Response) => {
  const { replacements, pagination } = await RMAReplacementServices.getReplacements(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Replacements retrieved",
    data: replacements,
    pagination,
  });
});

const getReplacementBySerial = catchAsync(async (req: Request, res: Response) => {
  const serial = req.params.serial as string;
  const result = await RMAReplacementServices.getReplacementBySerial(serial);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Replacement record found" : "Replacement record not found",
    data: result,
  });
});

export const RMAReplacementControllers = {
  createReplacement,
  getReplacements,
  getReplacementBySerial,
};
