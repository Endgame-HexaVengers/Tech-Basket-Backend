import type { ErrorRequestHandler } from "express";
import AppError from "../../errors/AppError.js";

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: Array<{ path: string | number; message: string }> = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err?.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    if (Array.isArray(err?.issues)) {
      errorMessages = err.issues.map((issue: { path: (string | number)[]; message: string }) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
    }
  } else if (err?.name === "ValidationError") {
    statusCode = 400;
    message = "Mongoose Validation Error";
    if (err.errors) {
      errorMessages = Object.values(err.errors).map((val: any) => ({
        path: val.path,
        message: val.message,
      }));
    }
  } else if (err?.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field ${err?.path}: ${err?.value}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    const match = err.message.match(/"([^"]*)"/);
    const value = match ? match[1] : "";
    message = `Duplicate field value: '${value}'. Please use another value!`;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};
