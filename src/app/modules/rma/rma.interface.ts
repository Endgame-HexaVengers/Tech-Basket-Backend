import type { Types } from "mongoose";

export type RMAStatus =
  | "REQUESTED"
  | "RECEIVED"
  | "DIAGNOSING"
  | "REPAIRING"
  | "READY"
  | "COMPLETED"
  | "REJECTED";

export type RMAResolution = "REPAIRED" | "REPLACED" | "REFUNDED" | "REJECTED";

export interface IRMACustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface IRMA {
  rmaNumber: string;
  sale?: Types.ObjectId;
  branch: Types.ObjectId;
  product: Types.ObjectId;
  serialNumber?: string;
  customer: IRMACustomer;
  issue: string;
  description?: string;
  receivedDate: Date;
  status: RMAStatus;
  diagnosis?: string;
  resolution?: RMAResolution;
  technician?: Types.ObjectId;
  completedDate?: Date;
  cost?: number;
}
