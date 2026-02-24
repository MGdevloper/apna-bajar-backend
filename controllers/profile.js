import { json } from "express"
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
        const { phone, address, role, _id } = req.body;

        // Validate required fields
        console.log(address);


        if (role == "customer") {
            if (!_id || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: _id and role"
                });
            }

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
        // Update only the fields present in req.body
    } catch (error) {
        next(error);
    }
};