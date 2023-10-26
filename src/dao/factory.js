import { PERCISTENCE, MONGODB_CNX_STR } from "../config/configs";
import mongoose from "mongoose";
import ContactsMemory from "../contactmemory/contactMemory.js";

let Contacts;

switch(PERCISTENCE){
    case "MONGO":
        const connection = mongoose.connect(MONGODB_CNX_STR)
        const {default:ContactsMDB} = await import ("../mongo/contact.js");
        Contacts = ContactsMDB;
        break;
    case "MEMORY":
        const {default:ContactsMemory} = await import("../contactmemory/contactMemory.js");
        Contacts = ContactsMemory;
        break;
}

export default Contacts;