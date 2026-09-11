import type { Types } from "mongoose";

export type SupplierClaimStatus =
  | "SENT"
  | "RECEIVED"
  | "INSPECTION"
  | "APPROVED"
  | "REPAIRING"
  | "REPLACED"
  | "REJECTED"
  | "COMPLETED";

export type SupplierClaimOutcome = "REPAIRED" | "REPLACED" | "REJECTED" | "CREDIT_NOTE";

export interface ISupplierClaim {
  claimNumber: string;
  rma: Types.ObjectId;
  supplier: Types.ObjectId;
  product: Types.ObjectId;
  serialNumber: string;
  sentDate: Date;
  receivedDate?: Date;
  status: SupplierClaimStatus;
  supplierResponse?: string;
  outcome?: SupplierClaimOutcome;
  replacementSerial?: string;
  repairDetails?: string;
  notes?: string;
}
