import mongoose from "mongoose";
import AppError from "../../../errors/AppError.js";
import { BranchInventoryModel, SerialNumberModel } from "../inventory/inventory.model.js";
import type { IPurchase } from "./purchases.interface.js";
import { PurchaseModel } from "./purchases.model.js";

const generatePurchaseNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await PurchaseModel.countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  return `PO-${dateStr}-${serial}`;
};

const createPurchase = async (payload: Partial<IPurchase>) => {
  if (!payload.branch) {
    throw new AppError(400, "Branch is required for purchase");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!payload.items || payload.items.length === 0) {
      throw new AppError(400, "Purchase must contain at least one item");
    }

    if (!payload.purchaseNumber) {
      payload.purchaseNumber = await generatePurchaseNumber();
    }

    // Calculate total amount if not provided
    let totalAmount = 0;
    for (const item of payload.items) {
      item.subtotal = item.quantity * item.unitCost;
      totalAmount += item.subtotal;
    }
    payload.totalAmount = payload.totalAmount || totalAmount;

    // Create purchase document
    const [purchase] = await PurchaseModel.create([payload], { session });
    if (!purchase) {
      throw new AppError(500, "Failed to create purchase order");
    }

    // Update inventory and insert serial numbers if status is RECEIVED
    if (payload.status === "RECEIVED" || !payload.status) {
      for (const item of payload.items) {
        // Upsert branch inventory
        await BranchInventoryModel.findOneAndUpdate(
          { product: item.product, branch: payload.branch } as any,
          {
            $inc: {
              quantity: item.quantity,
              availableQuantity: item.quantity,
            },
          },
          { upsert: true, new: true, session }
        );

        // Insert serial numbers if provided
        if (item.serialNumbers && item.serialNumbers.length > 0) {
          const serialDocs = item.serialNumbers.map((s) => ({
            serialNumber: s.toUpperCase(),
            product: item.product,
            branch: payload.branch!,
            purchase: purchase._id,
            status: "AVAILABLE" as const,
          }));

          await SerialNumberModel.insertMany(serialDocs, { session });
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    return PurchaseModel.findById(purchase._id)
      .populate("supplier", "name contactPerson email phone")
      .populate("branch", "branchName branchCode")
      .populate("receivedBy", "name email")
      .populate("items.product", "title sku basePrice");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getPurchases = async (query: Record<string, any>) => {
  const { supplier, branch, status, search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (supplier) filter.supplier = supplier;
  if (branch) filter.branch = branch;
  if (status) filter.status = status;
  if (search) {
    filter.purchaseNumber = { $regex: search, $options: "i" };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [purchases, total] = await Promise.all([
    PurchaseModel.find(filter)
      .populate("supplier", "name contactPerson email phone")
      .populate("branch", "branchName branchCode")
      .populate("receivedBy", "name email")
      .populate("items.product", "title sku basePrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    PurchaseModel.countDocuments(filter),
  ]);

  return {
    purchases,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getPurchaseById = async (id: string) => {
  return PurchaseModel.findById(id)
    .populate("supplier", "name contactPerson email phone")
    .populate("branch", "branchName branchCode")
    .populate("receivedBy", "name email")
    .populate("items.product", "title sku basePrice");
};

export const PurchaseServices = {
  createPurchase,
  getPurchases,
  getPurchaseById,
};
