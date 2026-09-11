import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { BranchServices } from "./branches.services.js";

const createBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchServices.createBranch(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Branch created successfully",
    data: result,
  });
});

const getBranches = catchAsync(async (req: Request, res: Response) => {
  const { branches, pagination } = await BranchServices.getBranches(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branches retrieved successfully",
    data: branches,
    pagination,
  });
});

const getBranchById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BranchServices.getBranchById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Branch retrieved successfully" : "Branch not found",
    data: result,
  });
});

const updateBranch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BranchServices.updateBranch(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Branch updated successfully" : "Branch not found",
    data: result,
  });
});

const deleteBranch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BranchServices.deleteBranch(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Branch deleted successfully" : "Branch not found",
    data: result,
  });
});

export const BranchControllers = {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
