import { Types } from 'mongoose';

export interface IProduct {
  sku: string;
  title: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  basePrice: number;
  warrantyMonths: number;
  description?: string;
  imageUrl?: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'OUT_OF_STOCK';
}