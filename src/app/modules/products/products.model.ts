import { model, Schema } from "mongoose";
import type { IProduct } from "./products.interface.js";

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    basePrice: { type: Number, required: true, min: 0 },
    warrantyMonths: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "DISCONTINUED", "OUT_OF_STOCK"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<IProduct>("Product", productSchema);