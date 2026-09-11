import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { TransferControllers } from "./transfers.controller.js";

const transferRouter = Router();

transferRouter.post("/", auth(), TransferControllers.createTransfer);
transferRouter.get("/", TransferControllers.getTransfers);
transferRouter.get("/movements", TransferControllers.getStockMovements);
transferRouter.get("/:id", TransferControllers.getTransferById);
transferRouter.patch("/:id/approve", auth(), TransferControllers.approveTransfer);
transferRouter.patch("/:id/ship", auth(), TransferControllers.shipTransfer);
transferRouter.patch("/:id/receive", auth(), TransferControllers.receiveTransfer);

export default transferRouter;
