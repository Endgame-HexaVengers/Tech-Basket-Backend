import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AppError from "../../../errors/AppError.js";
import type { ICreateUserPayload, ILoginPayload, IUser, UserRole } from "./users.interface.js";
import { UserModel } from "./users.model.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured and Update JWT_SECRET in .env file");
  }

  return secret;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const createUser = async (payload: ICreateUserPayload) => {
  const { confirmPassword, role, branch, ...userPayload } = payload;
  const normalizedRole: UserRole | undefined = role
    ? ({
      "SYSTEM ADMIN": "ADMIN",
      "STORE MANAGER": "MANAGER",
      "INVENTORY STAFF": "INVENTORY",
    }[role.trim().toUpperCase()] || role.trim().toUpperCase()) as UserRole
    : undefined;

  if (confirmPassword !== undefined && payload.password !== confirmPassword) {
    throw new AppError(400, "Password and confirm password do not match!");
  }

  if (branch && !mongoose.isValidObjectId(branch)) {
    throw new AppError(400, "Invalid branch id!");
  }

  const existing = await UserModel.findOne({
    $or: [{ email: payload.email }, ...(payload.username ? [{ username: payload.username }] : [])],
  });
  if (existing) {
    throw new AppError(400, existing.email === payload.email ? "User with this email already exists!" : "Username already exists!");
  }

  const user = await UserModel.create({
    ...userPayload,
    ...(normalizedRole ? { role: normalizedRole } : {}),
    ...(branch ? { branch } : {}),
  } as IUser);
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const loginUser = async (payload: ILoginPayload) => {
  const user = await UserModel.findOne({ email: payload.email }).select("+password").populate("branch");
  if (!user) {
    throw new AppError(404, "User not found with this email!");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(403, "Your account is inactive. Please contact administrator.");
  }

  if (payload.password && user.password) {
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
      throw new AppError(401, "Invalid password!");
    }
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      branch: user.branch
        ? (user.branch as any)._id?.toString() || user.branch.toString()
        : undefined,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    token,
  };
};

const getUsers = async (query: Record<string, any>) => {
  const { search, role, branch, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (role) filter.role = role;
  if (branch) filter.branch = branch;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .populate("branch", "branchName branchCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    UserModel.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getUserById = async (id: string) => {
  return UserModel.findById(id).populate("branch", "branchName branchCode");
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }

  return UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("branch", "branchName branchCode");
};

const deleteUser = async (id: string) => {
  return UserModel.findByIdAndDelete(id);
};

const deleteMyAccount = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

export const UserServices = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteMyAccount,
};
