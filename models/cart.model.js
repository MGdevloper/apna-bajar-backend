import mongoose from "mongoose";

let cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true,
    },


    items:
    {

        type: [{
            shopkeeperId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "shopkeeper",
            },
            count:{
                type:Number,
                default:1
            }
            ,

            itemName: {
                type: String,
                required: true
            },


            variant: {
                enum: ["kg", "gram", "liter", "ml", "piece", "pack"],
                type: String,
                required: true
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "variant",
                required: true
            }
            ,

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            }


        }],

        requireed: true
    },

    total: {
        type: Number,
        required: true,
        default: 0
    }

})

cartSchema.pre("save", function (next) {

    let total = 0;
    this.items.forEach((i) => {
        total += (i.quantity * i.price)
    })

    this.total = total;

})


const cartModel = mongoose.model("cart", cartSchema)

export default cartModel