import type { Request, Response } from "express";
import { ProductServices } from "./products.services.js";

const getProductId = (req: Request, res: Response) => {
	const { id } = req.params;
	if (typeof id !== "string") {
		res.status(400).json({ success: false, message: "Product id is required" });
		return null;
	}

	return id;
};

const createProduct = async (req: Request, res: Response) => {
	const result = await ProductServices.createProduct(req.body);
	res.status(201).json({ success: true, data: result });
};

const getProducts = async (_req: Request, res: Response) => {
	const result = await ProductServices.getProducts();
	
	res.status(200).json({ success: true, data: result });
};

const getProductById = async (req: Request, res: Response) => {
	const id = getProductId(req, res);
	if (!id) return;

	const result = await ProductServices.getProductById(id);
	if (!result) {
		res.status(404).json({ success: false, message: "Product not found" });
		return;
	}

	res.status(200).json({ success: true, data: result });
};

const updateProduct = async (req: Request, res: Response) => {
	const id = getProductId(req, res);
	if (!id) return;

	const result = await ProductServices.updateProduct(id, req.body);
	if (!result) {
		res.status(404).json({ success: false, message: "Product not found" });
		return;
	}

	res.status(200).json({ success: true, data: result });
};

const deleteProduct = async (req: Request, res: Response) => {
	const id = getProductId(req, res);
	if (!id) return;

	const result = await ProductServices.deleteProduct(id);
	if (!result) {
		res.status(404).json({ success: false, message: "Product not found" });
		return;
	}

	res.status(200).json({ success: true, message: "Product deleted successfully" });
};

export const ProductControllers = {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};