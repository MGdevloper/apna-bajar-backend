import mongoose from "mongoose";

const generateOrderNumber = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${Date.now()}-${randomSuffix}`;
};


let orderItemSchema = new mongoose.Schema({

    itemName: {
        type: String,
        required: true
    }
    ,
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    variant: {
        type: String,
        required: true,
        enum: ["kg", "gram", "liter", "ml", "piece", "pack"]
    }

    ,
    price: {
        type: Number,
        required: true,
        min: 0
    }
    ,
    count: {
        type: Number,
        default: 1,
        min: 1
    },

})
let orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            default: generateOrderNumber,
            trim: true,
        },

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


        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "ready for pickup", "completed"],
            default: "pending"

        }
        ,
        total: {
            type: Number,
            required: true,
            min: 0
        },


        items: [orderItemSchema]

    },
    { timestamps: true }
)


const orderModel = mongoose.model("order", orderSchema)

export default orderModel
