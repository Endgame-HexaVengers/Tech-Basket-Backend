import type { IAuditLog } from "./auditLogs.interface.js";
import { AuditLogModel } from "./auditLogs.model.js";

const recordLog = async (payload: IAuditLog) => {
  return AuditLogModel.create(payload);
};

const getLogs = async (query: Record<string, any>) => {
  const { action, entity, user, page = 1, limit = 50 } = query;
  const filter: Record<string, any> = {};

  if (action) filter.action = action;
  if (entity) filter.entity = entity;
  if (user) filter.user = user;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [logs, total] = await Promise.all([
    AuditLogModel.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    AuditLogModel.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const AuditLogServices = {
  recordLog,
  getLogs,
};
