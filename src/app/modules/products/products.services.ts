import type { IProduct } from "./products.interface.js";
import { ProductModel } from "./products.model.js";

const createProduct = async (payload: IProduct) => {
	return ProductModel.create(payload);
};

const getProducts = async () => {
	return ProductModel.find().sort({ createdAt: -1 });
};

const getProductById = async (id: string) => {
	return ProductModel.findById(id);
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
	return ProductModel.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});
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


