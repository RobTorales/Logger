import CartManager from "../dao/CartManager.js";

class CartServices{
    constructor (){
        this.CartManager = new CartManager();    
    }

    async newCart (){
        return await this.CartManager.newCart();
    }

    async getCart(id){
        return await this.CartManager.getCart(id);
    }

    async addProduct(cid, pid){
        const resultado = await this.CartManager.addProduct(cid, pid);

        if (resultado) {
            return{status:"ok", message:"El Producto se agregó correctamente!"};
        } else {
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async updateQuantity (cid, pid, quantity) {
         const result = await this.CartManager.updateQuantity(cid, pid, quantity);

         if (result) {
            res.send({status:"ok", message:"El producto se actualizó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo actualizar el Producto del Carrito!"});
        }
    }

    async updateCart(cartId, products) {
        const result = await this.cartManager.updateProducts(cartId, products);
        if (result) {
          return { status: "ok", message: "El carrito se actualizó correctamente" };
        } else {
          throw new Error("Error: No se pudo actualizar el carrito");
        }
      }

    async deleteProduct (cid, pid){
        const result = await this.CartManager.deleteProduct(cid, pid);

        if (result) {
            res.send({status:"ok", message:"El producto se eliminó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo eliminar el Producto del Carrito!"});
        }

        return await this.CartManager.deleteProduct(cid, pid);
    }

    async cleanCart (cid){
        const result = await this.CartManager.cleanCart(cid);
    
        if (result) {
            res.send({status:"ok", message:"El carrito se vació correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo vaciar el Carrito!"});
        }

        return await this.CartManager.cleanCart(cid);
    }

    async updateCart(cid, products) {
        const result = await this.CartManager.updateCart(cid, products);
    
        if (result) {
            res.send({status:"ok", message:"El producto se agregó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo agregar el Producto al Carrito!"});
        }

        return await this.CartManager.updateCart(cid, products);
    }
}

export default CartServices;