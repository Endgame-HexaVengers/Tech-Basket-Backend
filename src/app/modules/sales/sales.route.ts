import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { SaleControllers } from "./sales.controller.js";

const saleRouter = Router();

saleRouter.post("/", auth(), SaleControllers.createSale);
saleRouter.get("/", SaleControllers.getSales);
saleRouter.get("/invoice/:invoice", SaleControllers.getSaleByInvoice);
saleRouter.get("/:id", SaleControllers.getSaleById);

export default saleRouter;
