import type { Types } from "mongoose";

export type UserRole = "ADMIN" | "MANAGER" | "SALES" | "INVENTORY" | "SUPPORT";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  branch?: Types.ObjectId;
  phone?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ILoginPayload {
  email: string;
  password?: string;
}

export interface IAuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    branch?: any;
    image?: string;
  };
  token: string;
}
