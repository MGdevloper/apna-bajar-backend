import mongoose from "mongoose";


let orderItemSchema = new mongoose.Schema({

    itemname: {
        type: String,
        required: true
    }
    ,
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    unit:{
        type:String,
        required:true,
        enum:["kg","gram","liter","ml","piece","pack"]
    }

    ,
    prince:{
        type:Number,
        required:true,
        min:0
    }
    ,
    count:{
        type:Number,
        default:1,
        min:1
    }
})
let orderSchema = new mongoose.Schema(
    {

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "customer"


        },

        shopkeeperId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "shopkeeper"
        },
        customerName: {
            type: String,
            required: true
        },
        shopkeeperName: {
            type: String,
            required: true
        }
        ,        
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "ready for pickup", "completed"],
            default: "pending"

        }
        ,


        items: [orderItemSchema]

    },
    { timestamps: true }
)  


const orderModel = mongoose.model("order", orderSchema)

export default orderModel
