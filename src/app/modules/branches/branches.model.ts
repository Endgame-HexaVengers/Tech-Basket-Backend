import { Schema, model } from "mongoose";
import type { IBranch } from "./branches.interface.js";

const branchSchema = new Schema<IBranch>(
  {
    branchName: { type: String, required: true, trim: true },
    branchCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
    },
    phone: { type: String, required: true, trim: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const BranchModel = model<IBranch>("Branch", branchSchema);
