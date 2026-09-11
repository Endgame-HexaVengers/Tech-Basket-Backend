import { Schema, model } from "mongoose";
import type { IStockMovement, IStockTransfer, ITransferItem } from "./transfers.interface.js";

const transferItemSchema = new Schema<ITransferItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productUnit: { type: Schema.Types.ObjectId, ref: "SerialNumber" },
    serialNumber: { type: String, trim: true, uppercase: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const stockTransferSchema = new Schema<IStockTransfer>(
  {
    transferNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    fromBranch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    toBranch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    items: [transferItemSchema],
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "SHIPPED", "RECEIVED", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    shippedAt: { type: Date },
    receivedAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const StockTransferModel = model<IStockTransfer>("StockTransfer", stockTransferSchema);

const stockMovementSchema = new Schema<IStockMovement>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productUnit: { type: Schema.Types.ObjectId, ref: "SerialNumber" },
    fromBranch: { type: Schema.Types.ObjectId, ref: "Branch" },
    toBranch: { type: Schema.Types.ObjectId, ref: "Branch" },
    type: {
      type: String,
      enum: [
        "PURCHASE",
        "SALE",
        "SALE_RETURN",
        "TRANSFER",
        "RMA_RECEIVED",
        "RMA_SENT_TO_SUPPLIER",
        "RMA_RETURNED",
        "REPLACEMENT",
        "ADJUSTMENT",
      ],
      required: true,
    },
    quantity: { type: Number, required: true },
    referenceType: { type: String, trim: true },
    referenceId: { type: Schema.Types.ObjectId },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ fromBranch: 1, toBranch: 1 });

export const StockMovementModel = model<IStockMovement>("StockMovement", stockMovementSchema);
