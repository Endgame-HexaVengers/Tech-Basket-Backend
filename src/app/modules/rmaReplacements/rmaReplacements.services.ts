import mongoose from "mongoose";
import AppError from "../../../errors/AppError.js";
import { SerialNumberModel } from "../inventory/inventory.model.js";
import { RMAModel } from "../rma/rma.model.js";
import type { IRMAReplacement } from "./rmaReplacements.interface.js";
import { RMAReplacementModel } from "./rmaReplacements.model.js";

const createReplacement = async (payload: IRMAReplacement) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const rma = await RMAModel.findById(payload.rma).session(session);
    if (!rma) {
      throw new AppError(404, "RMA ticket not found");
    }

    // 1. Mark old serial as REPLACED
    await SerialNumberModel.findOneAndUpdate(
      { serialNumber: payload.oldSerialNumber.toUpperCase() },
      { status: "REPLACED" },
      { session }
    );

    // 2. Insert new serial
    await SerialNumberModel.create(
      [
        {
          serialNumber: payload.newSerialNumber.toUpperCase(),
          product: payload.product,
          branch: rma.branch,
          status: "AVAILABLE",
        },
      ],
      { session }
    );

    // 3. Create replacement mapping
    const [replacement] = await RMAReplacementModel.create([payload], { session });

    // 4. Update RMA status to PRODUCT_RECEIVED and record resolution
    rma.status = "PRODUCT_RECEIVED" as any;
    rma.resolution = "REPLACED";
    await rma.save({ session });

    await session.commitTransaction();
    session.endSession();

    return RMAReplacementModel.findById(replacement?._id)
      .populate("product", "title sku basePrice")
      .populate("supplier", "name")
      .populate("rma", "rmaNumber customer")
      .populate("processedBy", "name email");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getReplacements = async (query: Record<string, any>) => {
  const { search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { oldSerialNumber: { $regex: search, $options: "i" } },
      { newSerialNumber: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [replacements, total] = await Promise.all([
    RMAReplacementModel.find(filter)
      .populate("product", "title sku basePrice")
      .populate("supplier", "name")
      .populate("rma", "rmaNumber customer")
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    RMAReplacementModel.countDocuments(filter),
  ]);

  return {
    replacements,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getReplacementBySerial = async (serial: string) => {
  const upper = serial.toUpperCase();
  return RMAReplacementModel.findOne({
    $or: [{ oldSerialNumber: upper }, { newSerialNumber: upper }],
  })
    .populate("product", "title sku basePrice")
    .populate("supplier", "name")
    .populate("rma", "rmaNumber customer")
    .populate("processedBy", "name email");
};

export const RMAReplacementServices = {
  createReplacement,
  getReplacements,
  getReplacementBySerial,
};
