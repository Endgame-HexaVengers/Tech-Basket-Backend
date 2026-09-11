import type { Types } from "mongoose";

export interface ISaleCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface ISaleItem {
  product: Types.ObjectId;
  serialNumber?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export type PaymentMethod = "CASH" | "CARD" | "MFS" | "ONLINE";
export type PaymentStatus = "PAID" | "PARTIAL" | "DUE";
export type SaleStatus = "COMPLETED" | "CANCELLED" | "REFUNDED";

export interface ISale {
  invoiceNumber: string;
  branch: Types.ObjectId;
  customer: ISaleCustomer;
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  soldBy: Types.ObjectId;
  saleDate: Date;
  status: SaleStatus;
  notes?: string;
}
