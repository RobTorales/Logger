import usersModel from "../dao/models/user.model.github.js";

class ContactsMDB {
    constructor(){

    }

    get =async ()=>{
        let contacts = await usersModel.find();
        return contacts;
    }
    insert =async  (first_name, last_name, email, password, phone)=>{
        let contact = {first_name, last_name, email, password, phone};
        await usersModel.create(contact);

    }
    update = async (email, contact)=>{
        return await usersModel.updateOne({email:email}, {name: contact.name, email:contact.email, password:contact.password, phone: contact.phone});
    }
    delete =async(email)=>{
        await usersModel.deleteOne({email:email});
        return await usersModel.find();
    }
}

export default ContactsMDB;