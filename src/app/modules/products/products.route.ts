import { Router } from "express";
import { ProductControllers } from "./products.controller.js";

const productRouter = Router();

productRouter.get("/", ProductControllers.getProducts);
productRouter.get("/:id", ProductControllers.getProductById);
productRouter.post("/", ProductControllers.createProduct);
productRouter.patch("/:id", ProductControllers.updateProduct);
productRouter.delete("/:id", ProductControllers.deleteProduct);

export default productRouter;