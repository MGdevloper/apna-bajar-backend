import e, { json } from "express"
import { customerModel } from "../models/customer.model.js"
import { shopkeeperModel } from "../models/shopkeeper.model.js"
import jwt from "jsonwebtoken"

export const getProfile = async (req, res, next) => {
    let { token } = req.body

    let decoded = jwt.verify(token, process.env.secret)

    // @ts-ignore
    if (decoded.role === "customer") {
        // @ts-ignore
        let user = await customerModel.findById(decoded.id).select(["-password", "-otp", "-otpExpireTime", '-restotpExpireTime', "-resetpassotp"])
        return res.json({ success: true, user })
    }
    // @ts-ignore
    else if (decoded.role === "shopkeeper") {
        // @ts-ignore
        let user = await shopkeeperModel.findById(decoded.id).select(["-password", "-otp", "-otpExpireTime", '-restotpExpireTime', "-resetpassotp"])
        return res.json({ success: true, user })
    }
    // @ts-ignore
    else if (decoded.role === "deliverypartner") {
        // @ts-ignore
        let user = await shopkeeperModel.findOne({ "deliverypartners._id": decoded._id })
        return res.json({ success: true, user })
    }
    //i want role from decoded token and then find user from that role and return user details



}

export const updateProfile = async (req, res, next) => {
    try {
        const { phone, address, role, _id, ownername, shopname, category } = req.body;

        // Validate required fields
        console.log('====================================');
        console.log({ phone, address, role, _id, ownername, shopname, category } );
        console.log('====================================');
        if (!_id || !role) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: _id and role"
            });
        }


        if (role == "customer") {

            // Build update object with only provided fields

            if (phone) {
                const updatedUser = await customerModel.findByIdAndUpdate(
                    _id,
                    { phone: phone },
                    { new: true, runValidators: true }
                );

                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                });


            }

            if (address) {
                const updatedUser = await customerModel.findByIdAndUpdate(
                    _id,
                    { address: address },
                    { new: true, runValidators: true }
                );

                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                });


            }

            else {
                return res.status(400).json({
                    success: false,
                    message: "No fields to update"
                });
            }
        }


        if (role == "shopkeeper") {



            if (phone) {
                console.log("new phone",phone);
                
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                    _id,
                    {phone: phone}
                    , { new: true, runValidators: true });


                await updatedUser.save();
                console.log('====================================');
                console.log(updatedUser);
                console.log('====================================');
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                }, { new: true, runValidators: true });
            }
            if (ownername) {
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                    _id,
                    { name: ownername },
                    { new: true, runValidators: true }
                );
                await updatedUser.save();
                console.log(updatedUser);
                
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                })
            }
            if (shopname) {
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                    _id,
                    { shopname: shopname },
                    { new: true, runValidators: true }
                );
                await updatedUser.save();
                return res.status(200).json({

                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                })
            }
            if (category) {
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                    _id,
                    { category: category },
                    { new: true, runValidators: true }
                );
                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                })
            }

            if(address){
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(

                    _id,
                    {shopaddress:address},
                    { new: true, runValidators: true }
                )

                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "No fields to update"
                });
            }
        }
        // Update only the fields present in req.body
    } catch (error) {
        next(error);
    }
};