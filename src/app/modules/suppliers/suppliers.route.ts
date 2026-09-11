import { Router } from "express";
import { SupplierControllers } from "./suppliers.controller.js";

const supplierRouter = Router();

supplierRouter.post("/", SupplierControllers.createSupplier);
supplierRouter.get("/", SupplierControllers.getSuppliers);
supplierRouter.get("/:id", SupplierControllers.getSupplierById);
supplierRouter.patch("/:id", SupplierControllers.updateSupplier);
supplierRouter.delete("/:id", SupplierControllers.deleteSupplier);

export default supplierRouter;
