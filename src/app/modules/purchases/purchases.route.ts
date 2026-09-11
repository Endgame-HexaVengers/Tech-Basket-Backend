import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { PurchaseControllers } from "./purchases.controller.js";

const purchaseRouter = Router();

purchaseRouter.post("/", auth(), PurchaseControllers.createPurchase);
purchaseRouter.get("/", PurchaseControllers.getPurchases);
purchaseRouter.get("/:id", PurchaseControllers.getPurchaseById);

export default purchaseRouter;
