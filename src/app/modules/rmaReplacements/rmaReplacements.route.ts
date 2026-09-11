import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { RMAReplacementControllers } from "./rmaReplacements.controller.js";

const rmaReplacementRouter = Router();

rmaReplacementRouter.post("/", auth(), RMAReplacementControllers.createReplacement);
rmaReplacementRouter.get("/", RMAReplacementControllers.getReplacements);
rmaReplacementRouter.get("/serial/:serial", RMAReplacementControllers.getReplacementBySerial);

export default rmaReplacementRouter;
