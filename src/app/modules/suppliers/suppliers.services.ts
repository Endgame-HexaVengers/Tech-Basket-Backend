import type { ISupplier } from "./suppliers.interface.js";
import { SupplierModel } from "./suppliers.model.js";

const createSupplier = async (payload: ISupplier) => {
  return SupplierModel.create(payload);
};

const getSuppliers = async (query: Record<string, any>) => {
  const { search, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [suppliers, total] = await Promise.all([
    SupplierModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    SupplierModel.countDocuments(filter),
  ]);

  return {
    suppliers,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getSupplierById = async (id: string) => {
  return SupplierModel.findById(id);
};

const updateSupplier = async (id: string, payload: Partial<ISupplier>) => {
  return SupplierModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteSupplier = async (id: string) => {
  return SupplierModel.findByIdAndDelete(id);
};

export const SupplierServices = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
