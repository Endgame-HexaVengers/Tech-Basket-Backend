import { Router } from "express";
import { CategoryControllers } from "./categories.controller.js";

const categoryRouter = Router();

categoryRouter.post("/", CategoryControllers.createCategory);
categoryRouter.get("/", CategoryControllers.getCategories);
categoryRouter.get("/:id", CategoryControllers.getCategoryById);
categoryRouter.patch("/:id", CategoryControllers.updateCategory);
categoryRouter.delete("/:id", CategoryControllers.deleteCategory);

export default categoryRouter;
