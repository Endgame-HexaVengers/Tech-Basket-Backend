import { Router } from "express";
import { InventoryControllers } from "./inventory.controller.js";

const inventoryRouter = Router();

inventoryRouter.get("/", InventoryControllers.getInventory);
inventoryRouter.get("/serials", InventoryControllers.getSerialNumbers);
inventoryRouter.get("/serials/:code", InventoryControllers.getSerialNumberByCode);
inventoryRouter.get("/:id", InventoryControllers.getInventoryById);
inventoryRouter.patch("/:id", InventoryControllers.updateInventory);

export default inventoryRouter;
