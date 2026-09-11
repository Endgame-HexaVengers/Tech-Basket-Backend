import { Schema, model } from "mongoose";
import type { IRMAReplacement } from "./rmaReplacements.interface.js";

const rmaReplacementSchema = new Schema<IRMAReplacement>(
  {
    rma: { type: Schema.Types.ObjectId, ref: "RMA", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    oldSerialNumber: { type: String, required: true, uppercase: true, trim: true },
    newSerialNumber: { type: String, required: true, uppercase: true, trim: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    replacementType: {
      type: String,
      enum: ["SUPPLIER", "INTERNAL_STOCK"],
      default: "SUPPLIER",
      required: true,
    },
    reason: { type: String, required: true, trim: true },
    processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

rmaReplacementSchema.index({ oldSerialNumber: 1 });
rmaReplacementSchema.index({ newSerialNumber: 1 });

export const RMAReplacementModel = model<IRMAReplacement>(
  "RMAReplacement",
  rmaReplacementSchema
);
