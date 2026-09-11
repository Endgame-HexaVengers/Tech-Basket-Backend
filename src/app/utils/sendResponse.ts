import type { Response } from "express";

interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  pagination?: IPaginationMeta;
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    pagination: data.pagination,
    data: data.data,
  });
};
