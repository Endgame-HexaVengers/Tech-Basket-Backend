import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { CustomerServices } from "./customers.services.js";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerServices.createCustomer(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Customer created successfully",
    data: result,
  });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const { customers, pagination } = await CustomerServices.getCustomers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Customers retrieved successfully",
    data: customers,
    pagination,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CustomerServices.getCustomerById(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Customer found" : "Customer not found",
    data: result,
  });
});

const getCustomerByPhone = catchAsync(async (req: Request, res: Response) => {
  const phone = req.params.phone as string;
  const result = await CustomerServices.getCustomerByPhone(phone);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Customer found" : "Customer not found",
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CustomerServices.updateCustomer(id, req.body);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Customer updated successfully" : "Customer not found",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CustomerServices.deleteCustomer(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Customer deleted successfully" : "Customer not found",
    data: result,
  });
});

export const CustomerControllers = {
  createCustomer,
  getCustomers,
  getCustomerById,
  getCustomerByPhone,
  updateCustomer,
  deleteCustomer,
};
