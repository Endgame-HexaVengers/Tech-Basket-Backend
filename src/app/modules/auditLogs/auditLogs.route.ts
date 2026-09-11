import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { AuditLogControllers } from "./auditLogs.controller.js";

const auditLogRouter = Router();

auditLogRouter.get("/", auth("ADMIN", "MANAGER"), AuditLogControllers.getLogs);

export default auditLogRouter;
