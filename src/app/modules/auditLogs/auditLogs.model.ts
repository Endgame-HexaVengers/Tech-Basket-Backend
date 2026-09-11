import { Schema, model } from "mongoose";
import type { IAuditLog } from "./auditLogs.interface.js";

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "SALE",
        "PURCHASE",
        "TRANSFER",
        "RMA_UPDATE",
        "WARRANTY",
        "REPLACEMENT",
      ],
      required: true,
    },
    entity: { type: String, required: true, trim: true },
    entityId: { type: Schema.Types.ObjectId },
    details: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ entity: 1, action: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = model<IAuditLog>("AuditLog", auditLogSchema);
