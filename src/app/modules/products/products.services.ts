import type { IProduct } from "./products.interface.js";
import { LegacyProductModel, ProductModel } from "./products.model.js";

const createProduct = async (payload: IProduct) => {
  return ProductModel.create(payload);
};

const mergeProducts = (items: any[]) => {
  const uniqueProducts = new Map<string, any>();

  for (const item of items) {
    if (!item) continue;

    const key = item?._id ? String(item._id) : String(item.sku || Math.random());
    if (!uniqueProducts.has(key)) {
      uniqueProducts.set(key, item);
    }
  }

  return Array.from(uniqueProducts.values());
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

  const [productsFromMain, productsFromLegacy] = await Promise.all([
    ProductModel.find(filter).sort(sort).lean(),
    LegacyProductModel.find(filter).sort(sort).lean(),
  ]);

  const mergedProducts = mergeProducts([...productsFromMain, ...productsFromLegacy]).sort((a: any, b: any) => {
    const first = new Date(a?.createdAt || 0).getTime();
    const second = new Date(b?.createdAt || 0).getTime();
    return String(sort).startsWith("-") ? second - first : first - second;
  });

  const total = mergedProducts.length;
  const paginatedProducts = mergedProducts.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

  return {
    products: paginatedProducts,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getProductById = async (id: string) => {
  const product = await ProductModel.findById(id).lean();
  if (product) return product;

  return LegacyProductModel.findById(id).lean();
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const product = await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (product) return product;

  return LegacyProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteProduct = async (id: string) => {
  const product = await ProductModel.findByIdAndDelete(id);
  if (product) return product;

  return LegacyProductModel.findByIdAndDelete(id);
};

export const ProductServices = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
