import mongoose from "mongoose";
import AppError from "../../../errors/AppError.js";
import { BranchInventoryModel, SerialNumberModel } from "../inventory/inventory.model.js";
import type { IStockTransfer } from "./transfers.interface.js";
import { StockMovementModel, StockTransferModel } from "./transfers.model.js";

const generateTransferNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await StockTransferModel.countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  return `TR-${dateStr}-${serial}`;
};

const createTransfer = async (payload: Partial<IStockTransfer>) => {
  if (!payload.items || payload.items.length === 0) {
    throw new AppError(400, "Transfer must contain at least one item");
  }

  if (!payload.fromBranch || !payload.toBranch) {
    throw new AppError(400, "Source and destination branches are required");
  }

  if (payload.fromBranch.toString() === payload.toBranch.toString()) {
    throw new AppError(400, "Source and destination branches cannot be the same");
  }

  if (!payload.transferNumber) {
    payload.transferNumber = await generateTransferNumber();
  }

  // Validate stock at source branch
  for (const item of payload.items) {
    const inv = await BranchInventoryModel.findOne({
      product: item.product as any,
      branch: payload.fromBranch as any,
    });
    if (!inv || inv.availableQuantity < item.quantity) {
      throw new AppError(
        400,
        `Insufficient available stock for product at source branch`
      );
    }
  }

  return StockTransferModel.create(payload);
};

const getTransfers = async (query: Record<string, any>) => {
  const { fromBranch, toBranch, status, search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (fromBranch) filter.fromBranch = fromBranch;
  if (toBranch) filter.toBranch = toBranch;
  if (status) filter.status = status;
  if (search) filter.transferNumber = { $regex: search, $options: "i" };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [transfers, total] = await Promise.all([
    StockTransferModel.find(filter)
      .populate("fromBranch", "branchName branchCode")
      .populate("toBranch", "branchName branchCode")
      .populate("requestedBy", "name email")
      .populate("approvedBy", "name email")
      .populate("items.product", "title sku basePrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    StockTransferModel.countDocuments(filter),
  ]);

  return {
    transfers,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getTransferById = async (id: string) => {
  return StockTransferModel.findById(id)
    .populate("fromBranch", "branchName branchCode")
    .populate("toBranch", "branchName branchCode")
    .populate("requestedBy", "name email")
    .populate("approvedBy", "name email")
    .populate("items.product", "title sku basePrice");
};

const approveTransfer = async (id: string, userId: string) => {
  const transfer = await StockTransferModel.findById(id);
  if (!transfer) throw new AppError(404, "Transfer not found");
  if (transfer.status !== "PENDING") {
    throw new AppError(400, `Cannot approve transfer in '${transfer.status}' status`);
  }

  transfer.status = "APPROVED";
  transfer.approvedBy = new mongoose.Types.ObjectId(userId);
  await transfer.save();
  return transfer;
};

const shipTransfer = async (id: string) => {
  const transfer = await StockTransferModel.findById(id);
  if (!transfer) throw new AppError(404, "Transfer not found");
  if (transfer.status !== "APPROVED") {
    throw new AppError(400, `Cannot ship transfer in '${transfer.status}' status`);
  }

  transfer.status = "SHIPPED";
  transfer.shippedAt = new Date();
  await transfer.save();
  return transfer;
};

const receiveTransfer = async (id: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transfer = await StockTransferModel.findById(id).session(session);
    if (!transfer) throw new AppError(404, "Transfer not found");
    if (transfer.status !== "SHIPPED") {
      throw new AppError(400, `Cannot receive transfer with status '${transfer.status}'`);
    }

    // Decrement fromBranch, increment toBranch
    for (const item of transfer.items) {
      await BranchInventoryModel.findOneAndUpdate(
        { product: item.product, branch: transfer.fromBranch } as any,
        {
          $inc: {
            quantity: -item.quantity,
            availableQuantity: -item.quantity,
          },
        },
        { session }
      );

      await BranchInventoryModel.findOneAndUpdate(
        { product: item.product, branch: transfer.toBranch } as any,
        {
          $inc: {
            quantity: item.quantity,
            availableQuantity: item.quantity,
          },
        },
        { upsert: true, new: true, session }
      );

      // Move serials if assigned
      if (item.serialNumber) {
        await SerialNumberModel.findOneAndUpdate(
          { serialNumber: item.serialNumber.toUpperCase() },
          { branch: transfer.toBranch },
          { session }
        );
      }

      // Log stock movement
      await StockMovementModel.create(
        [
          {
            product: item.product,
            fromBranch: transfer.fromBranch,
            toBranch: transfer.toBranch,
            type: "TRANSFER",
            quantity: item.quantity,
            referenceType: "StockTransfer",
            referenceId: transfer._id,
            performedBy: new mongoose.Types.ObjectId(userId),
            notes: `Transfer ${transfer.transferNumber} received`,
          },
        ],
        { session }
      );
    }

    transfer.status = "RECEIVED";
    transfer.receivedAt = new Date();
    await transfer.save({ session });

    await session.commitTransaction();
    session.endSession();

    return StockTransferModel.findById(id)
      .populate("fromBranch", "branchName branchCode")
      .populate("toBranch", "branchName branchCode");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getStockMovements = async (query: Record<string, any>) => {
  const { product, fromBranch, toBranch, type, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (product) filter.product = product;
  if (fromBranch) filter.fromBranch = fromBranch;
  if (toBranch) filter.toBranch = toBranch;
  if (type) filter.type = type;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [movements, total] = await Promise.all([
    StockMovementModel.find(filter)
      .populate("product", "title sku basePrice")
      .populate("fromBranch", "branchName branchCode")
      .populate("toBranch", "branchName branchCode")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    StockMovementModel.countDocuments(filter),
  ]);

  return {
    movements,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const TransferServices = {
  createTransfer,
  getTransfers,
  getTransferById,
  approveTransfer,
  shipTransfer,
  receiveTransfer,
  getStockMovements,
};
