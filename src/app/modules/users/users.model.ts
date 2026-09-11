import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import type { IUser } from "./users.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "SALES", "INVENTORY", "SUPPORT"],
      default: "SALES",
      required: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    phone: { type: String, trim: true },
    image: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel = model<IUser>("User", userSchema);
