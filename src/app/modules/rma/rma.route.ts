import { Router } from "express";
import { RMAControllers } from "./rma.controller.js";

const rmaRouter = Router();

rmaRouter.post("/", RMAControllers.createRMA);
rmaRouter.get("/", RMAControllers.getRMAs);
rmaRouter.get("/:id", RMAControllers.getRMAById);
rmaRouter.patch("/:id", RMAControllers.updateRMA);

export default rmaRouter;
