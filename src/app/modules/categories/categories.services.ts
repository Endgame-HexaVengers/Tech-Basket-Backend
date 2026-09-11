import type { ICategory } from "./categories.interface.js";
import { CategoryModel } from "./categories.model.js";

const createCategory = async (payload: ICategory) => {
  return CategoryModel.create(payload);
};

const getCategories = async (query: Record<string, any>) => {
  const { search, status } = query;
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  return CategoryModel.find(filter).sort({ name: 1 }).lean();
};

const getCategoryById = async (id: string) => {
  return CategoryModel.findById(id);
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  return CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteCategory = async (id: string) => {
  return CategoryModel.findByIdAndDelete(id);
};

export const CategoryServices = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
