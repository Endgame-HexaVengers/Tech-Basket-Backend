import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { SupplierClaimControllers } from "./supplierClaims.controller.js";

const supplierClaimRouter = Router();

supplierClaimRouter.post("/", auth(), SupplierClaimControllers.createClaim);
supplierClaimRouter.get("/", SupplierClaimControllers.getClaims);
supplierClaimRouter.get("/:id", SupplierClaimControllers.getClaimById);
supplierClaimRouter.patch("/:id", auth(), SupplierClaimControllers.updateClaim);

export default supplierClaimRouter;
