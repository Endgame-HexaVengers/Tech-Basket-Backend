import { Router } from "express";
import { BrandControllers } from "./brands.controller.js";

const brandRouter = Router();

brandRouter.post("/", BrandControllers.createBrand);
brandRouter.get("/", BrandControllers.getBrands);
brandRouter.get("/:id", BrandControllers.getBrandById);
brandRouter.patch("/:id", BrandControllers.updateBrand);
brandRouter.delete("/:id", BrandControllers.deleteBrand);

export default brandRouter;
