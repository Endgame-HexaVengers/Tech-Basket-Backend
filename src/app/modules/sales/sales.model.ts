import { Schema, model } from "mongoose";
import type { ISale, ISaleItem } from "./sales.interface.js";

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    serialNumber: { type: String, trim: true, uppercase: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    invoiceNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
    },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "MFS", "ONLINE"],
      default: "CASH",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIAL", "DUE"],
      default: "PAID",
      required: true,
    },
    soldBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    saleDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["COMPLETED", "CANCELLED", "REFUNDED"],
      default: "COMPLETED",
      required: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const SaleModel = model<ISale>("Sale", saleSchema);
