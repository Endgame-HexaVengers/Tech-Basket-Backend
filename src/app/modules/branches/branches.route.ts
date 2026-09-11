import { Router } from "express";
import { BranchControllers } from "./branches.controller.js";

const branchRouter = Router();

branchRouter.post("/", BranchControllers.createBranch);
branchRouter.get("/", BranchControllers.getBranches);
branchRouter.get("/:id", BranchControllers.getBranchById);
branchRouter.patch("/:id", BranchControllers.updateBranch);
branchRouter.delete("/:id", BranchControllers.deleteBranch);

export default branchRouter;
