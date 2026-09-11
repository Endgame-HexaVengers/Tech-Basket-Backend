import type { Types } from "mongoose";

export interface IBranchInventory {
  product: Types.ObjectId;
  branch: Types.ObjectId;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
}

export type SerialStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "RETURNED" | "RMA" | "DAMAGED";

export interface ISerialNumber {
  serialNumber: string;
  product: Types.ObjectId;
  branch: Types.ObjectId;
  purchase?: Types.ObjectId;
  sale?: Types.ObjectId;
  status: SerialStatus;
}
