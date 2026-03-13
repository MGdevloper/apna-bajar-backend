// @ts-nocheck
import mongoose, { get } from "mongoose";
import productModel from "../models/products.model.js";
import jwt from "jsonwebtoken"
import { shopkeeperModel } from "../models/shopkeeper.model.js";
export const addproduct = async (req, res) => {

    let { token, name, quantity, unit, price } = req.body

    let decode = jwt.decode(token)
    // @ts-ignore
    let shopkeeperId = decode.id
    let user = await shopkeeperModel.findOne({ _id: shopkeeperId })

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false })
    }



    let dataexist = await productModel.findOne({ shopkeeprid: shopkeeperId })

    if (!dataexist) {
        let product = await productModel.create({
            shopkeeprid: shopkeeperId,
            products: [{
                name: name,

                variants: [{
                    quantity: Number(quantity),
                    unit: unit,
                    price: Number(price)
                }]
            }]
        })

        await product.save()
        return res.status(200).json({ message: "Product added successfully", products: product.products, success: true })
    }

    let product = await productModel.findByIdAndUpdate(dataexist._id, {
        $push: {
            products: {
                name: name,
                variants: [{
                    quantity: Number(quantity),
                    unit: unit,
                    price: Number(price)
                }]
            }
        }
    }, { new: true })

    return res.status(200).json({ message: "Product updated successfully", products: product.products, success: true })
}




export const getproducts = async (req, res) => {

    let { token } = req.body
    let decode = jwt.decode(token)
    // @ts-ignore
    let user = await shopkeeperModel.findOne({ _id: decode.id })

    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false })
    }

    // @ts-ignore
    let products = await productModel.findOne({ shopkeeprid: decode.id })


    if (products?.products.length == 0 || !products) {
        return res.json({ message: "No products found", products: [], success: true })
    }
    return res.status(200).json({ message: "Products fetched successfully", products: products.products || [], success: true })
}

export const deleteproduct = async (req, res) => {
    let { token, product_id } = req.body

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    let decode = jwt.verify(token, process.env.secret)
    console.log('====================================');
    console.log(decode);
    console.log('====================================');
    // @ts-ignore
    let user = await shopkeeperModel.findOne({ _id: decode.id })
    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false })
    }
    // @ts-ignore

    const updatedDoc = await productModel.findOneAndUpdate(
        { shopkeeprid: new mongoose.Types.ObjectId(decode.id) },
        {
            $pull: {
                products: { _id: new mongoose.Types.ObjectId(product_id) }
            }
        },
        { new: true }
    );


    console.log('====================================');
    console.log(updatedDoc);
    console.log('====================================');

    if (updatedDoc?.products.length == 0 || !updatedDoc) {
        return res.json({ message: "No products found", products: [], success: true })
    }


    return res.status(200).json({ message: "Product deleted successfully", products: updatedDoc.products, success: true })
}

export const editproductname = async (req, res) => {


    let { product_id, token, newname } = req.body;
    let shopkeeperid = jwt.verify(token, process.env.secret).id

    let product = await productModel.findOneAndUpdate(
        { shopkeeprid: shopkeeperid, "products._id": product_id }
        , {
            $set: { "products.$.name": newname }
        },
        { new: true }
    )

    // await product.save()

    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false })
    }

    return res.status(200).json({ message: "Product name updated successfully", products: product.products, success: true })

}

export const addvariant = async (req, res) => {

    let { product_id, token, quantity, unit, price } = req.body;
    let shopkeeperid = jwt.verify(token, process.env.secret).id

    let product = await productModel.findOneAndUpdate(

        { shopkeeprid: shopkeeperid, "products._id": product_id },

        {
            $push: {
                "products.$.variants": {
                    quantity: Number(quantity),
                    unit: unit,
                    price: Number(price)
                }
            }
        },
        { new: true }

    )



    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false })
    }
    return res.status(200).json({ message: "Variant added successfully", products: product.products, success: true })

}

export const deletevariant = async (req, res) => {

    let { product_id, token, variant_id } = req.body;
    let shopkeeperid = jwt.verify(token, process.env.secret).id
    let product = await productModel.findOneAndUpdate(

        { shopkeeprid: shopkeeperid, "products._id": product_id },
        {
            $pull: { "products.$.variants": { _id: variant_id } }
        },
        { new: true }
    )


    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false })
    }
    return res.status(200).json({ message: "Variant deleted successfully", products: product.products, success: true })
}
export const editvariant = async (req, res) => {

    let { product_id, token, variant_id, quantity, unit, price } = req.body;
    let shopkeeperid = jwt.verify(token, process.env.secret).id

    let product = await productModel.findOneAndUpdate(
        { shopkeeprid: shopkeeperid, "products._id": product_id, "products.variants._id": variant_id },

        {
            $set: {
                "products.$[p].variants.$[v].quantity": Number(quantity),
                "products.$[p].variants.$[v].unit": unit,
                "products.$[p].variants.$[v].price": Number(price)
            }
        },
        {
            arrayFilters: [
                { "p._id": product_id },
                { "v._id": variant_id }
            ],

            new: true
        }



    )

    console.log('====================================');
    console.log(product);
    console.log('====================================');

    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false })
    }

    return res.status(200).json({ message: "Variant updated successfully", products: product.products, success: true })

}