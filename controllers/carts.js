// @ts-nocheck
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import cartModel from "../models/cart.model.js"

export const getcart = async (req, res, next) => {

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    let token = req.body.token

    let paylod = jwt.verify(token, process.env.secret)

    // @ts-ignore
    let cart = await cartModel.findOne({ customerId: paylod.id })

    if (!cart) {
        return res.status(200).json({ message: "Cart not found", success: false, cart: [] })
    }

    return res.status(200).json({ message: "Cart retrieved successfully", cart, success: true })

}

export const addtocart = async (req, res, next) => {



    try {

        console.log(req.body);

        let token = req.body.customerId
        console.log(token);


        let paylod = jwt.verify(token, process.env.secret)

        let customerId = paylod.id


        let user = await cartModel.findOne({ customerId })

        if (!user) {
            let newCart = new cartModel({
                customerId: customerId,

                items: [{
                    shopkeeperId: req.body.shopkeeperId,
                    itemName: req.body.itemName,
                    variant: req.body.variant,
                    variantId: req.body.variantId,
                    quantity: req.body.quantity,
                    price: req.body.price
                }]
            })
            await newCart.save()
            return res.status(200).json({ message: "Item added to cart successfully", success: true, cart: newCart.items })
        }

        else if (user) {

            console.log("in else if");

            let exist = user.items.find((i) => {
                return i.variantId.toString() === req.body.variantId
            })

            if (exist) {
                let newuser = await cartModel.findOneAndUpdate(
                    { customerId, "items.variantId": req.body.variantId },
                    { $inc: { "items.$.count": 1 } },
                    { new: true }
                )

                newuser.save()

                return res.status(200).json({ message: "Item updated in cart successfully", success: true, cart: newuser.items })

            }

            user.items.push({
                shopkeeperId: req.body.shopkeeperId,
                itemName: req.body.itemName,
                variant: req.body.variant,
                variantId: req.body.variantId,
                quantity: req.body.quantity,
                price: req.body.price
            })
            await user.save()
            return res.status(200).json({ message: "Item added to cart successfully", success: true, cart: user.items })

        }
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Invalid customer ID", success: false, error: error.message })
    }




}

export const removefromcart = async (req, res, next) => {



    let token = req.body.customerId

    let paylod = jwt.verify(token, process.env.secret)
    let customerId = paylod.id

    let variantId = req.body.variantId

    let user = await cartModel.findOneAndUpdate(

        { customerId: customerId },
        { $pull: { items: { variantId: variantId } } },
        { new: true }

    )

    if (!user) {
        return res.status(404).json({ message: "Cart not found", success: false })
    }

    return res.status(200).json({ message: "Item removed from cart successfully", success: true, cart: user.items })

}
export const clearcart = async (req, res, next) => {


    let token = req.body.customerId
    let paylod = jwt.verify(token, process.env.secret)
    let customerId = paylod.id

    let user = await cartModel.findOneAndUpdate(

        { customerId: customerId },
        { $set: { items: [] } },
        { new: true })

    if (!user) {
        return res.status(404).json({ message: "Cart not found", success: false })
    }

    return res.status(200).json({ message: "Cart cleared successfully", success: true, cart: user.items })
}

export const updatecart = async (req, res, next) => {

    let token = req.body.customerId

    let paylod = jwt.verify(token, process.env.secret)
    let customerId = paylod.id

    let variantId = req.body.variantId

    let user = await cartModel.findOneAndUpdate(
        { customerId: customerId, "items.variantId": variantId },
        // { $set: { "items.$.count":$ } }
        {$inc: { "items.$.count": -1 } },
        { new: true }

    )


    if (!user) {
        return res.status(404).json({ message: "Cart not found", success: false } )
    }
    return res.status(200).json({ message: "Cart updated successfully", success: true, cart: user.items })
}   