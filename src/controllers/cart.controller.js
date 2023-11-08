import { cartModel } from "../dao/models/cart.model.js";
import CartServices from "../services/cart.services.js";
import TicketController from "./ticket.controller.js";
import UserDTO from "../dao/dtos/user.dto.js";
import { ticketModel } from "../dao/models/ticket.model.js";
import ticketController from "./ticket.controller.js";


class CartController {
    constructor (){
        this.cartServices = new CartServices ();
    }

    newCart = async (req, res) => {
        const cart = await this.cartServices.newCart();
    
        if (cart) {
            res.send({status:"ok", message:"El Carrito se creó correctamente!", id:cart._id});
        } else {
            res.status(500).send({status:"error", message:"Error! No se pudo crear el Carrito!"});
        }
    }

    getCart = async (req, res) => {
        const cid = req.params.cid;
        const cart = await this.cartServices.getCart(cid);
    
        if (cart) {
            res.send({products:cart.products});
        } else {
            res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
        }
    }

    addProduct = async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await this.cartServices.addProduct(cid, pid);
    
        if (result) {
            res.send({ status: "ok", message: "El producto se agregó correctamente!" });
        } else {
            res.status(400).send({ status: "error", message: "Error! No se pudo agregar el Producto al Carrito!" });
        }
    }
    updateCart = async (req, res) => {
        const cid = req.params.cid;
        const products = req.body.products;
        const result = await this.cartServices.updateCart(cid, products);
    
        if (result) {
            res.send({status:"ok", message:"El producto se agregó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo agregar el Producto al Carrito!"});
        }
    }

    updateQuantity = async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const result = await this.cartServices.updateQuantity(cid, pid, quantity);
    
        if (result) {
            res.send({status:"ok", message:"El producto se actualizó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo actualizar el Producto del Carrito!"});
        }
    }

    deleteProduct = async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await this.cartServices.deleteProduct(cid, pid);
    
        if (result) {
            res.send({status:"ok", message:"El producto se eliminó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo eliminar el Producto del Carrito!"});
        }
    }

    cleanCart = async (req, res) => {
        const cid = req.params.cid;
        const result = await this.cartServices.cleanCart(cid);
    
        if (result) {
            res.send({status:"ok", message:"El carrito se vació correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo vaciar el Carrito!"});
        }
    }

    createPurchaseTicket = async (req, res) => {
        req.logger.info("Ruta /carts/:cid/purchase accedida");
        try {
            if (!req.user || !req.user.id) {
                throw new Error("Usuario no definido");
            }
    
            const cart = await this.cartServices.getCart(req.params.cid);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            
            req.logger.info("Productos en el carrito:", cart.products);

            const ProductManager = new ProductManager();
            const TicketController = new TicketController();
            const FailedProducts = [];
            const succesfulProducts = [];
    
            await Promise.all(
                cart.products.map(async (item) => {
                    const product = await ProductManager.getProductById(item.product);
    
                    if (!product || product.stock < item.quantity) {
                        FailedProducts.push(item);
                    } else {
                        succesfulProducts.push(item);
                        const newStock = product.stock - item.quantity;
                        await ProductManager.updateProduct(item.product, { stock: newStock });
                    }
                })
            );
    
            if (succesfulProducts.length === 0) {
                throw new Error("No se pudo comprar ningún producto");
            }
    
            const totalAmount = succesfulProducts.reduce((total, product) => {
                return total + product.product.price * product.quantity;
            }, 0);
    
            const ticketData = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email,
            };
    
            const ticketCreated = await TicketController.createTicket({
                body: ticketData,
            });
    
            await cartModel.updateOne(
                { _id: req.params.cid },
                { products: FailedProducts }
            );
    
            res.json({
                status: "success",
                message: "Compra realizada con éxito",
                ticket: ticketCreated,
                failedProducts: FailedProducts.length > 0 ? FailedProducts : undefined,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getPurchase = async (req,res) =>{
        const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);

      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    }
    async ticketEnd(req, res) {
        try {
          const { cid } = req.params;
          const infoUser = new UserDTO(req.session);
          const infoUserEmail = req.session.email;
          const cartFound = await this.cartService.getCart(cid);
          if (!cartFound) {
            throw new Error('Cart not found');
          }
    
          const idCart = cartFound._id;
    
          let cartConStock = [];
          let cartSinStock = [];
    

          cartFound.products.forEach((item) => {
            const idProduct = item._id._id.toString();
            const title = item._id.title;
            const quantityInCart = parseInt(item.quantity);
            const availableStock = parseInt(item._id.stock);
            const productPrice = parseInt(item._id.price);
    
            if (quantityInCart <= availableStock) {
              const precioTotalProducto = productPrice * quantityInCart;
              cartConStock.push({ idProduct, quantity: quantityInCart, precioTotalProducto, title });
              const product = this.productClass.getProductById(idProduct);
              let quantityTotal = availableStock - quantityInCart;
              productClass.updateOne(
                idProduct,
                product.title,
                product.description,
                product.price,
                product.thumbnails,
                product.code,
                quantityTotal,
                product.category,
                product.status
              );
            } else {
              cartSinStock.push({ idProduct, quantity: quantityInCart });
            }
          });
    
          let precioTotal = 0;
          cartConStock.forEach((producto) => {
            precioTotal += producto.precioTotalProducto * producto.quantity;
          });
    
          let cart = cartConStock.map((item) => {
            return {
              id: item.idProduct,
              quantity: item.quantity,
              price: item.precioTotalProducto,
              title: item.title,
            };
          });
    
          const ticketData = {
            code: '',
            purchase_datetime: new Date(),
            amount: precioTotal,
            purchaser: infoUserEmail,
            products: cart,
          };
    
          let ticket = await ticketModel.create(ticketData);
          let code = ticket._id.toString();
          await ticketModel.findByIdAndUpdate(ticket._id, { code: code });
          await this.cartService.deleteProducts(idCart);
          const idTicket = ticket._id;
          return res.status(200).render('ticketFinal', { idTicket, cart: cart, idCart, infoUser, precioTotal });
        } catch (error) {
          console.log(error);
        }
      }
    
}

    

export default CartController;