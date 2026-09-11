import type { Types } from "mongoose";

export interface IBranchAddress {
  street: string;
  city: string;
  state?: string;
  zip?: string;
}

export interface IBranch {
  branchName: string;
  branchCode: string;
  address: IBranchAddress;
  phone: string;
  manager?: Types.ObjectId;
  status: "ACTIVE" | "INACTIVE";
}
