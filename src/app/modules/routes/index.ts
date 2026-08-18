import { Router } from "express";
import productRouter from "../products/products.route.js";



const router = Router();

router.use("/products", productRouter);
// router.use("/brands", brandRouter);
// router.use("/categories", categoryRouter);

export default router;