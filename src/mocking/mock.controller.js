import { generateMockProduct } from "./utils.mocking.js";

const generateMockProducts = async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i < 101; i++) {
            products.push(generateMockProduct());
        }
        res.json(products); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get the products", message: error.message });
    }
};

export default generateMockProducts;