import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const checkSession = (req, res, next) => {
    console.log('Checking session:', req.session);
  
    if (req.session && req.session.user) {
      console.log('Session exists:', req.session.user);
      next();
    } else {
      console.log('No session found, redirecting to /login');
      res.redirect("/login");
    }
  };

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("home", {products});
});

router.get("/products", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("products", {products});
});

router.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const product = await PM.getProductById(pid);

    res.render("product", {product});
});

router.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);
    if (cart) {
        console.log(JSON.stringify(cart, null, 4));
        res.render("cart", { products: cart.products });
      } else {
        res.status(400).send({
          status: "error",
          message: "Error! No se encuentra el ID de Carrito!",
        });
      }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/profile", checkSession, (req, res) => {
    console.log('Inside /profile route');
  
    const userData = req.session.user;
    console.log('User data:', userData);
  
    res.render("profile", { user: userData });
  });

router.get("/register", async (req, res) => {
    res.render("register");
});

router.get("/profile", async (req, res) => {
    res.render("profile");
});

router.get("/restore", async (req, res) => {
    res.render("restore");
});

router.get("/faillogin", async (req, res) => {
    res.send({status:"error", message:"Login inválido!"});
});

router.get("/failregister", async (req, res) => {
    res.send({status:"Error", message:"Error! No se pudo registar el Usuario!"});
});

export default router;