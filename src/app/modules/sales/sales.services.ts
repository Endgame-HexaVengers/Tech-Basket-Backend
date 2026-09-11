import mongoose from "mongoose";
import AppError from "../../../errors/AppError.js";
import { BranchInventoryModel, SerialNumberModel } from "../inventory/inventory.model.js";
import { ProductModel } from "../products/products.model.js";
import type { ISale } from "./sales.interface.js";
import { SaleModel } from "./sales.model.js";

const generateInvoiceNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await SaleModel.countDocuments();
  const serial = String(count + 1).padStart(5, "0");
  return `INV-${dateStr}-${serial}`;
};

const createSale = async (payload: Partial<ISale>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!payload.items || payload.items.length === 0) {
      throw new AppError(400, "Sale must contain at least one item");
    }

    if (!payload.branch) {
      throw new AppError(400, "Branch is required for sales");
    }

    if (!payload.invoiceNumber) {
      payload.invoiceNumber = await generateInvoiceNumber();
    }

    let subtotal = 0;
    // Verify inventory and calculate subtotal
    for (const item of payload.items) {
      const product = await ProductModel.findById(item.product).session(session);
      if (!product) {
        throw new AppError(404, `Product not found with ID: ${item.product}`);
      }

      // Check branch stock
      const inventory = await BranchInventoryModel.findOne({
        product: item.product,
        branch: payload.branch,
      }).session(session);

      if (!inventory || inventory.availableQuantity < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for '${product.productTitle || product.title || "Product"}' at this branch. Available: ${
            inventory ? inventory.availableQuantity : 0
          }`
        );
      }

      // If serial number is supplied, check availability
      if (item.serialNumber) {
        const serialDoc = await SerialNumberModel.findOne({
          serialNumber: item.serialNumber.toUpperCase(),
          product: item.product,
          branch: payload.branch,
          status: "AVAILABLE",
        }).session(session);

        if (!serialDoc) {
          throw new AppError(
            400,
            `Serial number '${item.serialNumber}' is not available at this branch`
          );
        }
      }

      item.unitPrice = item.unitPrice || product.basePrice;
      const discount = item.discount || 0;
      item.total = item.quantity * item.unitPrice - discount;
      subtotal += item.total;
    }

    payload.subtotal = subtotal;
    const discount = payload.discount || 0;
    const tax = payload.tax || 0;
    payload.total = subtotal - discount + tax;

    // Create Sale record
    const [sale] = await SaleModel.create([payload], { session });
    if (!sale) {
      throw new AppError(500, "Failed to create sale order");
    }

    // Decrement inventory and mark serials as SOLD
    for (const item of payload.items) {
      await BranchInventoryModel.findOneAndUpdate(
        { product: item.product, branch: payload.branch },
        {
          $inc: {
            quantity: -item.quantity,
            availableQuantity: -item.quantity,
          },
        },
        { session }
      );

      if (item.serialNumber) {
        await SerialNumberModel.findOneAndUpdate(
          {
            serialNumber: item.serialNumber.toUpperCase(),
            product: item.product,
            branch: payload.branch,
          },
          {
            status: "SOLD",
            sale: sale._id,
          },
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return SaleModel.findById(sale._id)
      .populate("branch", "branchName branchCode")
      .populate("soldBy", "name email")
      .populate("items.product", "title sku basePrice warrantyMonths");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getSales = async (query: Record<string, any>) => {
  const { branch, paymentStatus, status, search, startDate, endDate, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (branch) filter.branch = branch;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (status) filter.status = status;

  if (startDate || endDate) {
    filter.saleDate = {};
    if (startDate) filter.saleDate.$gte = new Date(startDate);
    if (endDate) filter.saleDate.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [sales, total] = await Promise.all([
    SaleModel.find(filter)
      .populate("branch", "branchName branchCode")
      .populate("soldBy", "name email")
      .populate("items.product", "title sku basePrice warrantyMonths")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    SaleModel.countDocuments(filter),
  ]);

  return {
    sales,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getSaleById = async (id: string) => {
  return SaleModel.findById(id)
    .populate("branch", "branchName branchCode")
    .populate("soldBy", "name email")
    .populate("items.product", "title sku basePrice warrantyMonths");
};

const getSaleByInvoice = async (invoiceNumber: string) => {
  return SaleModel.findOne({ invoiceNumber: invoiceNumber.toUpperCase() })
    .populate("branch", "branchName branchCode")
    .populate("soldBy", "name email")
    .populate("items.product", "title sku basePrice warrantyMonths");
};

export const SaleServices = {
  createSale,
  getSales,
  getSaleById,
  getSaleByInvoice,
};
