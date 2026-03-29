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

        deliveryPartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        deliveryPartnerName: {
            type: String,
            default: "",
            trim: true,
        },

        deliveryPartnerEarning: {
            type: Number,
            default: 25,
            min: 0,
        },

        deliveryLocation: {
            latitude: {
                type: Number,
                default: null,
            },
            longitude: {
                type: Number,
                default: null,
            },
            heading: {
                type: Number,
                default: 0,
            },
            speed: {
                type: Number,
                default: 0,
            },
            updatedAt: {
                type: Date,
                default: null,
            },
        },


        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "assigned_to_delivery",
                "out_for_delivery",
                "delivered",
                "completed"
            ],
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
