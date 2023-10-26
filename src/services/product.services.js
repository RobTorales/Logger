import ProductManager from "../dao/ProductManager.js";

class ProductService {
    constructor(){
        this.ProductManager = new ProductManager();
    }

    async addProduct (product){
        return await this.ProductManager.addProduct(product);
    }
    async getProducts (params) {
        return await this.ProductManager.getProducts(params);
    }

    async getProductsById (id) {
        return await this.ProductManager.getProductsById(id);
    }

    async updateProduct (id, product) {
        return await this.ProductManager.updateProduct(id, product);
    }

    async deleteProduct (id) {
        return await this.ProductManager.deleteProduct(id);
    }
}

export default ProductService;