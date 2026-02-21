import mongoose from "mongoose";
import { customerModel } from "../models/customer.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import bcrypt from 'bcrypt'
import sendEmail from "../utils/sendmail.js";
import jwt from "jsonwebtoken"
export const Login = async (req, res, next) => {
    let { email, password } = req.body
    console.log(email,password);
    
    let user = await customerModel.findOne({ email })
    console.log(user);
    
    if (user) {
        let result = await bcrypt.compare(password, user.password)
       
        if (result == true) {


            let payload = {
                id: user._id,
                email: user.email,
                role: "customer"
            }


            let token = jwt.sign(payload, process.env.secret, { expiresIn: "7d" })
            return res.json({ message: "Login successfully ✅", success: true, type: "customer" ,token})

        }
        else {
            return res.json({ message: "Invalid credential", success: false })
        }
    }

    else if (!user) {

        let user = await shopkeeperModel.findOne({ email })
        if (user) {
            let result = await bcrypt.compare(password, user.password)
            if (result == true) {

                let payload = {
                    id: user._id,
                    email: user.email,
                    role: "shopkeeper"
                }
                let token = jwt.sign(payload, process.env.secret, { expiresIn: "7d" })

                return res.json({ message: "Login successfully ✅", success: true, type: "shopkeeper", token })
            }
            else {
                return res.json({ message: "Invalid credential", success: false })
            }
        }
        if(!user){
            return res.json({ message: "Invalid credential", success: false })
        }
    }
    else {
        return res.json({ message: "Invalid credential", success: false })
    }

}

export const deliverypartnerLogin = async (req, res, next) => {
    let { email } = req.body

    let shop = await shopkeeperModel.findOne({ "deliverypartners.email": email })
    if (!shop) {
        return res.json({ message: "user not found", success: false })
    }

    let otp = Math.floor(1000 + Math.random() * 9000).toString();
    let otpExpireTime = Date.now() + 5 * 60 * 1000



    let deliverypartners = shop.deliverypartners.find(partner => partner.email === email)
    deliverypartners.otp = await bcrypt.hash(otp, 10)
    deliverypartners.otpExpireTime = otpExpireTime
    await shop.save()
    try {

        await sendEmail(email, deliverypartners.name, "Login OTP", `<h3> Your OTP for login is </h3> <P> <b>${otp}</b> .It will expire in 5 minutes.</p>`)
        return res.json({ message: "OTP sent successfully ✅", success: true })
    }
    catch (err) {
        console.log("Error sending OTP email:", err);
        return res.status(500).json({ message: "Failed to send OTP email", success: false })
    }


}