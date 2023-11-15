import express from "express";
import __dirname from "./utils.js";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import emailRouter from "./routes/email.router.js";
import smsRouter from "./routes/sms.router.js";
import mockingRouter from "./mocking/mock.router.js";
import logsRouter from "./routes/logs.router.js";
import viewsRouter from "./routes/views.router.js";
import session from "express-session";
import { MONGODB_CNX_STR, PORT, SECRET_SESSIONS } from "./config/config.js";
import cookieParser from "cookie-parser";
import initializeGitHubPassport from "./github/ingreso.github.js";
import passport from "passport";
import cors from "cors";
import morgan from "morgan";
import initializePassport from "./config/passport.config.js";
import "./dao/dbConfig.js";
import { addLogger, devLogger } from "./config/logger.js";

const app = express();
const puerto = 8080;
app.use(cookieParser());
initializePassport();
initializeGitHubPassport();
app.use(passport.initialize());
app.use(addLogger);
app.use(morgan('dev'))


const httpServer = app.listen(PORT, () => {console.log(`conectado a ${PORT}`)})
const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CM = new ChatManager();

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGODB_CNX_STR,
        collectionName:"sessions"
    }),
    secret: SECRET_SESSIONS,
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false}
  }))
app.use(cors({
    credentials:true,
    method: ["GET", "POST", "PUT", "DELETE"]
}))
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use('/mockingproducts', mockingRouter);
app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);
app.use("/", viewsRouter);
app.use('/loggerTest', logsRouter)

mongoose.connect("mongodb+srv://roberto1608torales:roberto1608@cluster0.ggriuqe.mongodb.net/ecommerce?retryWrites=true&w=majority");

socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");

    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);

    socket.on("nuevoProducto", (data) => {
        const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
        PM.addProduct(product);
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("eliminarProducto", (data) => {
        PM.deleteProduct(parseInt(data));
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("newMessage", async (data) => {
        CM.createMessage(data);
        const messages = await CM.getMessages();
        socket.emit("messages", messages);
    });
});