import type { Types } from "mongoose";

export interface IRMAReplacement {
  rma: Types.ObjectId;
  product: Types.ObjectId;
  oldSerialNumber: string;
  newSerialNumber: string;
  supplier?: Types.ObjectId;
  replacementType: "SUPPLIER" | "INTERNAL_STOCK";
  reason: string;
  processedBy: Types.ObjectId;
}
