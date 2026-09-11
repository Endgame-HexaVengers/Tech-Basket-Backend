import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuditLogServices } from "./auditLogs.services.js";

const getLogs = catchAsync(async (req: Request, res: Response) => {
  const { logs, pagination } = await AuditLogServices.getLogs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Audit logs retrieved",
    data: logs,
    pagination,
  });
});

export const AuditLogControllers = {
  getLogs,
};
