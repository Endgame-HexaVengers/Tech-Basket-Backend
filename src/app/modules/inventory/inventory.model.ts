import { Schema, model } from "mongoose";
import type { IBranchInventory, ISerialNumber } from "./inventory.interface.js";

const branchInventorySchema = new Schema<IBranchInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    availableQuantity: { type: Number, required: true, min: 0, default: 0 },
    reservedQuantity: { type: Number, min: 0, default: 0 },
    damagedQuantity: { type: Number, min: 0, default: 0 },
    reorderLevel: { type: Number, min: 0, default: 5 },
  },
  { timestamps: true }
);

branchInventorySchema.index({ product: 1, branch: 1 }, { unique: true });

export const BranchInventoryModel = model<IBranchInventory>(
  "BranchInventory",
  branchInventorySchema
);

const serialNumberSchema = new Schema<ISerialNumber>(
  {
    serialNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    purchase: { type: Schema.Types.ObjectId, ref: "Purchase" },
    sale: { type: Schema.Types.ObjectId, ref: "Sale" },
    status: {
      type: String,
      enum: ["AVAILABLE", "RESERVED", "SOLD", "RETURNED", "RMA", "DAMAGED"],
      default: "AVAILABLE",
      required: true,
    },
  },
  { timestamps: true }
);

serialNumberSchema.index({ product: 1, branch: 1, status: 1 });

export const SerialNumberModel = model<ISerialNumber>(
  "SerialNumber",
  serialNumberSchema
);
