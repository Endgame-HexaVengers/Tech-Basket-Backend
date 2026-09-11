import { Schema, model } from "mongoose";
import type { ICustomer } from "./customers.interface.js";

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    customerType: {
      type: String,
      enum: ["RETAIL", "WHOLESALE", "CORPORATE"],
      default: "RETAIL",
      required: true,
    },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

customerSchema.index({ name: "text", email: "text" });

export const CustomerModel = model<ICustomer>("Customer", customerSchema);
