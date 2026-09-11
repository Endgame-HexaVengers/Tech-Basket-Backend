import type { IBrand } from "./brands.interface.js";
import { BrandModel } from "./brands.model.js";

const createBrand = async (payload: IBrand) => {
  return BrandModel.create(payload);
};

const getBrands = async (query: Record<string, any>) => {
  const { search, status } = query;
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  return BrandModel.find(filter).sort({ name: 1 }).lean();
};

const getBrandById = async (id: string) => {
  return BrandModel.findById(id);
};

const updateBrand = async (id: string, payload: Partial<IBrand>) => {
  return BrandModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteBrand = async (id: string) => {
  return BrandModel.findByIdAndDelete(id);
};

export const BrandServices = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
