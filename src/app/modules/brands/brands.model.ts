import { Schema, model } from "mongoose";
import type { IBrand } from "./brands.interface.js";

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    logo: { type: String, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const BrandModel = model<IBrand>("Brand", brandSchema);
