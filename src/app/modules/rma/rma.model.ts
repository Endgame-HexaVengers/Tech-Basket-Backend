import { Schema, model } from "mongoose";
import type { IRMA } from "./rma.interface.js";

const rmaSchema = new Schema<IRMA>(
  {
    rmaNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    sale: { type: Schema.Types.ObjectId, ref: "Sale" },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    serialNumber: { type: String, trim: true, uppercase: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    issue: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    receivedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "REQUESTED",
        "RECEIVED",
        "DIAGNOSING",
        "REPAIRING",
        "READY",
        "COMPLETED",
        "REJECTED",
      ],
      default: "REQUESTED",
      required: true,
    },
    diagnosis: { type: String, trim: true },
    resolution: {
      type: String,
      enum: ["REPAIRED", "REPLACED", "REFUNDED", "REJECTED"],
    },
    technician: { type: Schema.Types.ObjectId, ref: "User" },
    completedDate: { type: Date },
    cost: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const RMAModel = model<IRMA>("RMA", rmaSchema);
