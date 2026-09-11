import { Schema, model } from "mongoose";
import type { IProduct } from "./products.interface.js";

const productSchema = new Schema<IProduct>(
  {
    productTitle: { type: String, trim: true },
    title: { type: String, trim: true },
    sku: { type: String, required: true, trim: true },
    color: { type: String, trim: true },
    brandId: { type: String, trim: true },
    categoryId: { type: String, trim: true },
    brand: { type: Schema.Types.Mixed, ref: "Brand" },
    category: { type: Schema.Types.Mixed, ref: "Category" },
    basePrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    warrantyPeriod: { type: Number },
    warrantyUnit: { type: String },
    warrantyMonths: { type: Number, min: 0 },
    hasSerialNumber: { type: Boolean, default: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: {
      type: String,
      default: "ACTIVE",
    },
    approvalStatus: { type: String },
    createdBy: { type: String },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "TechBasket_all data",
    strict: false,
  }
);

export const ProductModel = model<IProduct>("Product", productSchema);