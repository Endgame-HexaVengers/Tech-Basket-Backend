import { Schema, model } from "mongoose";
import type { IPurchase, IPurchaseItem } from "./purchases.interface.js";

const purchaseItemSchema = new Schema<IPurchaseItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 },
    serialNumbers: [{ type: String, trim: true, uppercase: true }],
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const purchaseSchema = new Schema<IPurchase>(
  {
    purchaseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    items: [purchaseItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIAL", "DUE"],
      default: "PAID",
      required: true,
    },
    receivedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["RECEIVED", "PENDING", "CANCELLED"],
      default: "RECEIVED",
      required: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const PurchaseModel = model<IPurchase>("Purchase", purchaseSchema);
