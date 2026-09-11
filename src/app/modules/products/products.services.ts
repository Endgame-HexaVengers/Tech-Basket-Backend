import type { IProduct } from "./products.interface.js";
import { ProductModel } from "./products.model.js";

const createProduct = async (payload: IProduct) => {
  return ProductModel.create(payload);
};

const getProducts = async (query: Record<string, any> = {}) => {
  const { search, brand, category, status, page = 1, limit = 10, sort = "-createdAt" } = query;
  const filter: Record<string, any> = {};

  if (brand) {
    filter.$or = [{ brand }, { brandId: brand }];
  }
  if (category) {
    filter.$or = [{ category }, { categoryId: category }];
  }
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { productTitle: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { color: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.max(1, Number(limit) || 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getProductById = async (id: string) => {
  return ProductModel.findById(id).lean();
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  return ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteProduct = async (id: string) => {
  return ProductModel.findByIdAndDelete(id);
};

export const ProductServices = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
