import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/configs.js";

const URI = MONGODB_CNX_STR

try {
    await mongoose.connect(URI,({
        useNewUrlParser: true,
        useUnifiedTopology: true
      }))
    console.log("Conectado a MongoDB");
} catch (error) {
    console.log(error);
}