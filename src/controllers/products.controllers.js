import ProductService from "../services/product.services.js";

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProducts(req, res) {
        try {
            const products = await this.productService.getProducts(req.query);
            res.send(products);
        } catch (error) {
            this.handleError(res, "Error al obtener productos", error);
        }
    }

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const product = await this.productService.getProductbyId(pid);
            if (!product) {
                return res.status(404).send({ status: "error", message: "Producto no encontrado" });
            }
            res.json(product);
        } catch (error) {
            this.handleError(res, "Error al encontrar producto por su ID", error);
        }
    }

    async addProduct(req, res) {
        const { title, description, code, price, stock, category, thumbnail } = req.body;
        if (!this.validateRequiredFields(req.body, ["title", "description", "code", "price", "stock", "category", "thumbnail"])) {
            return res.status(400).send({ status: "error", message: "Faltan campos requeridos" });
        }
        try {
            const add = await this.productService.addProduct({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail,
            });
            if (add && add._id) {
                console.log("Producto añadido correctamente:",add);
                res.send({
                status: "ok",
                message: "El Producto se agregó correctamente!",
                });
                socketServer.emit("product_created", {
                _id: add._id,
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail,
                });
                return;
            } else {
                this.handleError(res, "No se pudo agregar el producto");
            }
        } catch (error) {
            this.handleError(res, "Error al agregar producto", error);
        }
    }

    async updateProduct(req, res) {
        try {
            const {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
              } = req.body;
              const pid = req.params.pid;
        
              const wasUpdated = await this.productService.updateProduct(pid, {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
              });
        
              if (wasUpdated) {
                res.send({
                  status: "ok",
                  message: "El Producto se actualizó correctamente!",
                });
                socketServer.emit("product_updated");
              } else {
                res.status(500).send({
                  status: "error",
                  message: "Error! No se pudo actualizar el Producto!",
                });
              }
        } catch (error) {
            console.log(error);
            res.status(500).send({status: "error", message: "Error Interno"});
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;

            if (!mongoose.Types.ObjectId.isValid(pid)) {
                console.log("ID del producto no válido");
                res.status(400).send({
                status: "error",
                message: "ID del producto no válido",
                });
                return;
            }

            const product = await this.productService.getProductById(pid);

            if (!product) {
                console.log("Producto no encontrado");
                res.status(404).send({
                status: "error",
                message: "Producto no encontrado",
                });
                return;
            }

            const wasDeleted = await this.productService.deleteProduct(pid);

            if (wasDeleted) {
                console.log("Producto eliminado exitosamente");
                res.send({
                status: "ok",
                message: "Producto eliminado exitosamente",
                });
                socketServer.emit("product_deleted", { _id: pid });
            } else {
                console.log("Error eliminando el producto");
                res.status(500).send({
                status: "error",
                message: "Error eliminando el producto",
                });
            }
        } catch (error) {
            this.handleError(res, "Error Interno", error);
        }
    }
}

export default ProductController;