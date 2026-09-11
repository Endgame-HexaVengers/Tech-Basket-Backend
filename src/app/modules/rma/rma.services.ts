import AppError from "../../../errors/AppError.js";
import { SerialNumberModel } from "../inventory/inventory.model.js";
import type { IRMA } from "./rma.interface.js";
import { RMAModel } from "./rma.model.js";

const generateRMANumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await RMAModel.countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  return `RMA-${dateStr}-${serial}`;
};

const createRMA = async (payload: Partial<IRMA>) => {
  if (!payload.rmaNumber) {
    payload.rmaNumber = await generateRMANumber();
  }

  const rma = await RMAModel.create(payload);

  if (payload.serialNumber) {
    await SerialNumberModel.findOneAndUpdate(
      { serialNumber: payload.serialNumber.toUpperCase() },
      { status: "RMA" }
    );
  }

  return RMAModel.findById(rma._id)
    .populate("product", "title sku basePrice warrantyMonths")
    .populate("branch", "branchName branchCode")
    .populate("sale", "invoiceNumber saleDate")
    .populate("technician", "name email");
};

const getRMAs = async (query: Record<string, any>) => {
  const { branch, status, search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (branch) filter.branch = branch;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { rmaNumber: { $regex: search, $options: "i" } },
      { serialNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [rmas, total] = await Promise.all([
    RMAModel.find(filter)
      .populate("product", "title sku basePrice warrantyMonths")
      .populate("branch", "branchName branchCode")
      .populate("sale", "invoiceNumber saleDate")
      .populate("technician", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    RMAModel.countDocuments(filter),
  ]);

  return {
    rmas,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getRMAById = async (id: string) => {
  return RMAModel.findById(id)
    .populate("product", "title sku basePrice warrantyMonths")
    .populate("branch", "branchName branchCode")
    .populate("sale", "invoiceNumber saleDate")
    .populate("technician", "name email");
};

const updateRMA = async (id: string, payload: Partial<IRMA>) => {
  if (payload.status === "COMPLETED" && !payload.completedDate) {
    payload.completedDate = new Date();
  }

  const result = await RMAModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("product", "title sku basePrice warrantyMonths")
    .populate("branch", "branchName branchCode")
    .populate("sale", "invoiceNumber saleDate")
    .populate("technician", "name email");

  if (!result) {
    throw new AppError(404, "RMA ticket not found");
  }

  return result;
};

export const RMAServices = {
  createRMA,
  getRMAs,
  getRMAById,
  updateRMA,
};
