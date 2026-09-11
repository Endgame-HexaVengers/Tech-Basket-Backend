import { Router } from "express";
import { CustomerControllers } from "./customers.controller.js";

const customerRouter = Router();

customerRouter.post("/", CustomerControllers.createCustomer);
customerRouter.get("/", CustomerControllers.getCustomers);
customerRouter.get("/phone/:phone", CustomerControllers.getCustomerByPhone);
customerRouter.get("/:id", CustomerControllers.getCustomerById);
customerRouter.patch("/:id", CustomerControllers.updateCustomer);
customerRouter.delete("/:id", CustomerControllers.deleteCustomer);

export default customerRouter;
