import type { Types } from "mongoose";

export interface IProduct {
  _id?: string | Types.ObjectId;
  productTitle?: string;
  title?: string;
  sku: string;
  color?: string;
  brandId?: string;
  categoryId?: string;
  brand?: Types.ObjectId | any;
  category?: Types.ObjectId | any;
  basePrice?: number;
  costPrice?: number;
  warrantyPeriod?: number;
  warrantyUnit?: string;
  warrantyMonths?: number;
  hasSerialNumber?: boolean;
  description?: string;
  imageUrl?: string;
  status?: string;
  approvalStatus?: string;
  createdBy?: string;
  approvedBy?: string | null;
  approvedAt?: Date | string | null;
  rejectionReason?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}