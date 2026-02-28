import e, { json } from "express"
import { customerModel } from "../models/customer.model.js"
import { shopkeeperModel } from "../models/shopkeeper.model.js"
import jwt from "jsonwebtoken"

export const getProfile = async (req, res, next) => {
    try {
        const tokenFromBody = req.body?.token
        const authHeader = req.headers?.authorization
        const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined
        const token = tokenFromBody || tokenFromHeader

        if (!token || typeof token !== "string") {
            return res.status(401).json({ success: false, message: "Token is required" })
        }

        const decoded = jwt.verify(token, process.env.secret)

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
            let user = await shopkeeperModel.findOne({ "deliverypartners._id": decoded.id })
            return res.json({ success: true, user })
        }

        return res.status(400).json({ success: false, message: "Invalid token role" })
    }
    catch (error) {
        if (error?.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" })
        }
        if (error?.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" })
        }
        next(error)
    }



}

export const updateProfile = async (req, res, next) => {
    try {
        const { phone, address, role, _id, ownername, shopname, category, deliverypartner_id, deliverypartner_phone, deliverypartner_name, deliverypartner_email } = req.body;

        // Validate required fields
        
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
                console.log("new phone", phone);

                const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                    _id,
                    { phone: phone }
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

            if (address) {
                const updatedUser = await shopkeeperModel.findByIdAndUpdate(

                    _id,
                    { shopaddress: address },
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

        if (role == "edit_deliverypartner") {

            if (deliverypartner_phone) {

                const updatedUser = await shopkeeperModel.findOneAndUpdate(
                    { "deliverypartners._id": deliverypartner_id },
                    { "deliverypartners.$.phone": phone },
                    { new: true, runValidators: true }


                )
                await updatedUser.save();

                return res.status(200).json({
                    success: true,
                    message: "Delivery partner updated successfully",
                    data: updatedUser
                })
            }

            if (deliverypartner_name) {
                const updatedUser = await shopkeeperModel.findOneAndUpdate(
                    { "deliverypartners._id": deliverypartner_id },
                    { "deliverypartners.$.name": deliverypartner_name },
                    { new: true, runValidators: true }
                )
                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Delivery partner updated successfully",
                    data: updatedUser
                })
            }
            if (deliverypartner_email) {
                const updatedUser = await shopkeeperModel.findOneAndUpdate(
                    { "deliverypartners._id": deliverypartner_id },
                    { "deliverypartners.$.email": deliverypartner_email },
                    { new: true, runValidators: true }
                )
                await updatedUser.save();
                return res.status(200).json({
                    success: true,
                    message: "Delivery partner updated successfully",
                    data: updatedUser
                })
            }
        }

        if (role == "delete_deliverypartner") {
            const updatedUser = await shopkeeperModel.findOneAndUpdate(
                { "deliverypartners._id": deliverypartner_id },
                { $pull: { deliverypartners: { _id: deliverypartner_id } } },
                { new: true, runValidators: true }
            )

            await updatedUser.save();
            return res.status(200).json({
                success: true,
                message: "Delivery partner deleted successfully",
                data: updatedUser
            })
        }

        if (role == "add_deliverypartner") {
            const existingPartner = await shopkeeperModel.findOne({ "deliverypartners.email": deliverypartner_email });
            if (existingPartner) {
                return res.status(400).json({
                    success: false,
                    message: "Delivery partner with this email already exists"
                })
            }

            const updatedUser = await shopkeeperModel.findByIdAndUpdate(
                _id,
                { $push: { deliverypartners: { name: deliverypartner_name, email: deliverypartner_email, phone: deliverypartner_phone } } },
                { new: true, runValidators: true }
            )

            await updatedUser.save();
            return res.status(200).json({
                success: true,
                message: "Delivery partner added successfully",
                data: updatedUser
            })
        }
        // Update only the fields present in req.body
    } catch (error) {
        next(error);
    }
};