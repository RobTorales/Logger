import { cartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import ProductManager from "./ProductManager.js";

class CartManager {
    constructor() {
      this.productManager = new ProductManager();
    }
    async newCart() {
        console.log("Cart created!");
        return await cartModel.create({products:[]});
    }

    async getCart(id) {
        try {
            return await cartModel.findOne({_id:id}) || null;
        } catch(error) {
            console.log("Not found!");

            return null;
        }
    }

    async getCarts() {
        return await cartModel.find().lean();
    }

    async addProduct (cid, pid, quantity) {
        try {
          console.log(`Adding product ${pid} to cart ${cid}`);
    
          if (
            mongoose.Types.ObjectId.isValid(cid) &&
            mongoose.Types.ObjectId.isValid(pid)
          ) {
            const product = await this.productManager.getProductById(pid);
    
            console.log("Stock antes de agregar al carrito:", product.stock);
    
            if (!product) {
              console.log("Product not found!");
              return {
                status: "error",
                message: "Producto no encontrado!",
              };
            }
    
            if (product.stock < quantity) { 
              return { status: "error", message: "Stock insuficiente!" };
          }
    
            const updateResult = await cartModel.updateOne(
              { _id: cid, "products.product": pid },
              { $inc: { "products.$.quantity": 1 } }
            );
    
            console.log("Update result:", updateResult);
            if (updateResult.matchedCount === 0) {
              const pushResult = await cartModel.updateOne(
                { _id: cid },
                { $push: { products: { product: pid, quantity: 1 } } }
              );
    
              console.log("Push result:", pushResult);
            }
    
            return {
              status: "ok",
              message: "El producto se agregó correctamente!",
            };
          } else {
            return {
              status: "error",
              message: "ID inválido!",
            };
          }
        } catch (error) {
          console.error(error);
          return {
            status: "error",
            message: "Ocurrió un error al agregar el producto al carrito!",
          };
        }
      }
    

    async updateProducts(cid, products) {
        try {
            await cartModel.updateOne({_id:cid}, {products:products}, {new:true, upsert:true});
            console.log("Product updated!");
    
            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            await cartModel.updateOne({_id:cid, products:{$elemMatch:{product:pid}}}, {$set:{"products.$.quantity":quantity}});
            console.log("Product updated!");
    
            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }

    async deleteProduct(cid, pid) {
        try {
            await cartModel.updateOne({_id:cid}, {$pull:{products:{product:pid}}});
            console.log("Product deleted!");
    
            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }

    async cleanCart(cid) {
        try {
            await cartModel.updateOne({_id:cid}, {products:[]});
            console.log("Products deleted!");
    
            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }
}

export default CartManager;