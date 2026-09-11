import { Schema, model } from "mongoose";
import type { ISupplierClaim } from "./supplierClaims.interface.js";

const supplierClaimSchema = new Schema<ISupplierClaim>(
  {
    claimNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    rma: { type: Schema.Types.ObjectId, ref: "RMA", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    serialNumber: { type: String, required: true, uppercase: true, trim: true },
    sentDate: { type: Date, default: Date.now },
    receivedDate: { type: Date },
    status: {
      type: String,
      enum: [
        "SENT",
        "RECEIVED",
        "INSPECTION",
        "APPROVED",
        "REPAIRING",
        "REPLACED",
        "REJECTED",
        "COMPLETED",
      ],
      default: "SENT",
      required: true,
    },
    supplierResponse: { type: String, trim: true },
    outcome: {
      type: String,
      enum: ["REPAIRED", "REPLACED", "REJECTED", "CREDIT_NOTE"],
    },
    replacementSerial: { type: String, uppercase: true, trim: true },
    repairDetails: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

supplierClaimSchema.index({ serialNumber: 1 });

export const SupplierClaimModel = model<ISupplierClaim>("SupplierClaim", supplierClaimSchema);
