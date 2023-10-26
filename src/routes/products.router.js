import { Router } from "express";
import ProductController from "../controllers/products.controllers.js";
console.log(ProductController);

const productsRouter = Router();
const productController = new ProductController();

productsRouter.get("/", productController.getProducts);


productsRouter.get("/:pid", productController.getProductById);


productsRouter.post("/", productController.addProduct);


productsRouter.put("/:pid", productController.updateProduct);


productsRouter.delete("/:pid", productController.deleteProduct);

export default productsRouter;