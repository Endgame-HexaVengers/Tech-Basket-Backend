import type { IWarranty } from "./warranties.interface.js";
import { WarrantyModel } from "./warranties.model.js";

const generateWarrantyNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await WarrantyModel.countDocuments();
  const serial = String(count + 1).padStart(5, "0");
  return `WAR-${dateStr}-${serial}`;
};

const createWarranty = async (payload: Partial<IWarranty>) => {
  if (!payload.warrantyNumber) {
    payload.warrantyNumber = await generateWarrantyNumber();
  }
  return WarrantyModel.create(payload);
};

const getWarranties = async (query: Record<string, any>) => {
  const { serialNumber, status, search, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (serialNumber) filter.serialNumber = serialNumber.toUpperCase();
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { warrantyNumber: { $regex: search, $options: "i" } },
      { serialNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [warranties, total] = await Promise.all([
    WarrantyModel.find(filter)
      .populate("product", "title sku warrantyMonths basePrice")
      .populate("sale", "invoiceNumber saleDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    WarrantyModel.countDocuments(filter),
  ]);

  return {
    warranties,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getWarrantyBySerial = async (serialNumber: string) => {
  return WarrantyModel.findOne({ serialNumber: serialNumber.toUpperCase() })
    .populate("product", "title sku warrantyMonths basePrice")
    .populate("sale", "invoiceNumber saleDate");
};

const getWarrantyById = async (id: string) => {
  return WarrantyModel.findById(id)
    .populate("product", "title sku warrantyMonths basePrice")
    .populate("sale", "invoiceNumber saleDate");
};

export const WarrantyServices = {
  createWarranty,
  getWarranties,
  getWarrantyBySerial,
  getWarrantyById,
};
