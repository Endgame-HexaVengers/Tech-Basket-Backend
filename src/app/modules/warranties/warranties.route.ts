import { Router } from "express";
import { WarrantyControllers } from "./warranties.controller.js";

const warrantyRouter = Router();

warrantyRouter.post("/", WarrantyControllers.createWarranty);
warrantyRouter.get("/", WarrantyControllers.getWarranties);
warrantyRouter.get("/serial/:serial", WarrantyControllers.getWarrantyBySerial);
warrantyRouter.get("/:id", WarrantyControllers.getWarrantyById);

export default warrantyRouter;
