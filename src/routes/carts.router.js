import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.post("/", cartController.newCart);
cartsRouter.get("/:cid", cartController.getCart);
cartsRouter.post("/:cid/products/:pid", cartController.addProduct);
cartsRouter.put("/:cid", cartController.updateCart);
cartsRouter.put("/:cid/products/:pid", cartController.updateQuantity);
cartsRouter.delete("/:cid/products/:pid", cartController.deleteProduct);
cartsRouter.delete("/:cid", cartController.cleanCart);
cartsRouter.post("/cid/purchase", cartController.createPurchaseTicket);

export default cartsRouter;