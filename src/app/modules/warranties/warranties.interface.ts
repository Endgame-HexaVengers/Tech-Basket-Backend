import type { Types } from "mongoose";

export type WarrantyStatus = "ACTIVE" | "EXPIRED" | "CLAIMED" | "VOID";

export interface IWarrantyCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface IWarranty {
  warrantyNumber: string;
  product: Types.ObjectId;
  serialNumber: string;
  customer: IWarrantyCustomer;
  sale?: Types.ObjectId;
  warrantyStart: Date;
  warrantyEnd: Date;
  status: WarrantyStatus;
  notes?: string;
}
