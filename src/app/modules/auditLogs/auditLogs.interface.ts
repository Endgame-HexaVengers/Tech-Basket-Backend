import type { Types } from "mongoose";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "SALE"
  | "PURCHASE"
  | "TRANSFER"
  | "RMA_UPDATE"
  | "WARRANTY"
  | "REPLACEMENT";

export interface IAuditLog {
  user?: Types.ObjectId;
  action: AuditAction;
  entity: string;
  entityId?: Types.ObjectId;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
