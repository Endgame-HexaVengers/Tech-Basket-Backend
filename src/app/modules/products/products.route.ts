import { Router } from "express";

const productRouter = Router();

productRouter.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Get all products",
    });
});

productRouter.get("/:id", (req, res) => {
    res.json({
        success: true,
        message: "Get single product",
        id: req.params.id,
    });
});

productRouter.post("/", (req, res) => {
    res.json({
        success: true,
        message: "Create product",
        data: req.body,
    });
});

productRouter.patch("/:id", (req, res) => {
    res.json({
        success: true,
        message: "Update product",
        id: req.params.id,
        data: req.body,
    });
});

productRouter.delete("/:id", (req, res) => {
    res.json({
        success: true,
        message: "Delete product",
        id: req.params.id,
    });
});

export default productRouter;