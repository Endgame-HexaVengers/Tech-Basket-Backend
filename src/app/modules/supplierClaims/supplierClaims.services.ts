import { SerialNumberModel } from "../inventory/inventory.model.js";
import { RMAModel } from "../rma/rma.model.js";
import type { ISupplierClaim } from "./supplierClaims.interface.js";
import { SupplierClaimModel } from "./supplierClaims.model.js";

const generateClaimNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await SupplierClaimModel.countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  return `CLM-${dateStr}-${serial}`;
};

const createClaim = async (payload: Partial<ISupplierClaim>) => {
  if (!payload.claimNumber) {
    payload.claimNumber = await generateClaimNumber();
  }

  const claim = await SupplierClaimModel.create(payload);

  // Update RMA status to SUPPLIER_CLAIM
  if (payload.rma) {
    await RMAModel.findByIdAndUpdate(payload.rma, {
      status: "SUPPLIER_CLAIM" as any,
    });
  }

  // Update serial status to SUPPLIER_HAND
  if (payload.serialNumber) {
    await SerialNumberModel.findOneAndUpdate(
      { serialNumber: payload.serialNumber.toUpperCase() },
      { status: "SUPPLIER_HAND" as any }
    );
  }

  return SupplierClaimModel.findById(claim._id)
    .populate("supplier", "name contactPerson email phone")
    .populate("product", "title sku basePrice")
    .populate("rma", "rmaNumber issue customer");
};

const getClaims = async (query: Record<string, any>) => {
  const { supplier, status, search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (supplier) filter.supplier = supplier;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { claimNumber: { $regex: search, $options: "i" } },
      { serialNumber: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [claims, total] = await Promise.all([
    SupplierClaimModel.find(filter)
      .populate("supplier", "name contactPerson email phone")
      .populate("product", "title sku basePrice")
      .populate("rma", "rmaNumber issue customer")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    SupplierClaimModel.countDocuments(filter),
  ]);

  return {
    claims,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getClaimById = async (id: string) => {
  return SupplierClaimModel.findById(id)
    .populate("supplier", "name contactPerson email phone")
    .populate("product", "title sku basePrice")
    .populate("rma", "rmaNumber issue customer");
};

const updateClaim = async (id: string, payload: Partial<ISupplierClaim>) => {
  if (payload.status === "COMPLETED" && !payload.receivedDate) {
    payload.receivedDate = new Date();
  }

  return SupplierClaimModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("supplier", "name contactPerson email phone")
    .populate("product", "title sku basePrice")
    .populate("rma", "rmaNumber issue customer");
};

export const SupplierClaimServices = {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
};
