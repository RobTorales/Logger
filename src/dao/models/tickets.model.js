import { Schema, model } from "mongoose";

const TicketSchema = new mongoose.Schema({
    id:Number,
    products: [
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity:{
                type:Number,
                default:0
            }
        }
    ],
    user:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ],
      reference: String 
});

export const ticketsModel = model('Tickets', TicketSchema)