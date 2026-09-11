import type { Types } from "mongoose";

export interface IPurchaseItem {
  product: Types.ObjectId;
  quantity: number;
  unitCost: number;
  serialNumbers?: string[];
  subtotal: number;
}

export type PurchasePaymentStatus = "PAID" | "PARTIAL" | "DUE";
export type PurchaseStatus = "RECEIVED" | "PENDING" | "CANCELLED";

export interface IPurchase {
  purchaseNumber: string;
  supplier: Types.ObjectId;
  branch: Types.ObjectId;
  items: IPurchaseItem[];
  totalAmount: number;
  paymentStatus: PurchasePaymentStatus;
  receivedBy: Types.ObjectId;
  purchaseDate: Date;
  status: PurchaseStatus;
  notes?: string;
}
