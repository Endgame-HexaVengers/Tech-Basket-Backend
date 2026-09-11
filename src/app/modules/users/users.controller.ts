import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { UserServices } from "./users.services.js";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { users, pagination } = await UserServices.getUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: users,
    pagination,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.getUserById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "User retrieved successfully" : "User not found",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  const result = await UserServices.getUserById(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Current user profile retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.updateUser(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "User updated successfully" : "User not found",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.deleteUser(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "User deleted successfully" : "User not found",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
};
