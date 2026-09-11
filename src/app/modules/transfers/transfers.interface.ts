import type { Types } from "mongoose";

export type TransferStatus = "PENDING" | "APPROVED" | "SHIPPED" | "RECEIVED" | "CANCELLED";

export interface ITransferItem {
  product: Types.ObjectId;
  productUnit?: Types.ObjectId;
  serialNumber?: string;
  quantity: number;
}

export interface IStockTransfer {
  transferNumber: string;
  fromBranch: Types.ObjectId;
  toBranch: Types.ObjectId;
  items: ITransferItem[];
  status: TransferStatus;
  requestedBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  shippedAt?: Date;
  receivedAt?: Date;
  notes?: string;
}

export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "SALE_RETURN"
  | "TRANSFER"
  | "RMA_RECEIVED"
  | "RMA_SENT_TO_SUPPLIER"
  | "RMA_RETURNED"
  | "REPLACEMENT"
  | "ADJUSTMENT";

export interface IStockMovement {
  product: Types.ObjectId;
  productUnit?: Types.ObjectId;
  fromBranch?: Types.ObjectId;
  toBranch?: Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: Types.ObjectId;
  performedBy?: Types.ObjectId;
  notes?: string;
  createdAt?: Date;
}
