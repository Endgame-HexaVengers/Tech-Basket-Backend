import { Schema, model } from "mongoose";
import type { IWarranty } from "./warranties.interface.js";

const warrantySchema = new Schema<IWarranty>(
  {
    warrantyNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    serialNumber: { type: String, required: true, uppercase: true, trim: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    sale: { type: Schema.Types.ObjectId, ref: "Sale" },
    warrantyStart: { type: Date, required: true, default: Date.now },
    warrantyEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CLAIMED", "VOID"],
      default: "ACTIVE",
      required: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

warrantySchema.index({ serialNumber: 1 });
warrantySchema.index({ "customer.phone": 1 });

export const WarrantyModel = model<IWarranty>("Warranty", warrantySchema);
