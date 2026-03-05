import mongoose from "mongoose";

const veriantSchema = new mongoose.Schema({

    quantity:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        required:true,
        enum:["kg","gram","liter","ml","piece","pack"]
    }

    ,
    price:{
        type:Number,
        required:true,
        min:0
    }

})


const singleProductSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    variants:[veriantSchema]
})

const ProductSchema = new mongoose.Schema({
    shopkeeprid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "shopkeeper",
        required: true,
        unique:true
    },

    products:[singleProductSchema]

},{timestamps:true})


const productModel = mongoose.model("product",ProductSchema)




export default productModel