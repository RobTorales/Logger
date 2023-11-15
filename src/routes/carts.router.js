import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../utils.js";
import { userModel } from "../dao/models/user.model.js";

const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.post("/", cartController.newCart);
cartsRouter.get("/:cid", cartController.getCart);
cartsRouter.post("/:cid/products/:pid", cartController.addProduct);
cartsRouter.put("/:cid", cartController.updateCart);
cartsRouter.put("/:cid/products/:pid", cartController.updateQuantity);
cartsRouter.delete("/:cid/products/:pid", cartController.deleteProduct);
cartsRouter.delete("/:cid", cartController.cleanCart);
cartsRouter.post("/:cid/purchase", cartController.createPurchaseTicket);

cartsRouter.get("/usuario/carrito", passportCall('jwt'), authorization(['user']), async (req, res) => {
    try {
      const userId = req.user._id; 
      const user = await userModel.findById(userId); 

      if (!user || !user.cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json({ id: user.cart });
    } catch (error) {
      req.logger.error("Error obteniendo el carrito del usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

export default cartsRouter;