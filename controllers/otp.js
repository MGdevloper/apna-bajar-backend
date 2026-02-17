import { customerModel } from "../models/customer.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import sendEmail from "../utils/sendmail.js";

import bcrypt from "bcrypt"


export const sendotp = async (req, res, next) => {

    console.log('====================================');
    console.log("role", req.body);
    console.log('====================================');



    if (req.body.role == "customer") {

        let user = await customerModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: "customer not found with this email" })


        }



        let otp = Math.floor(1000 + Math.random() * 9000);

        let otpExpireTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

        user.otp = await bcrypt.hash(otp.toString(), bcrypt.genSaltSync(10))

        user.otpExpireTime = otpExpireTime
        await user.save()

        try {

            await sendEmail(user.email, user.name, "Your OTP for ApnaBazar", `<h1>OTP for ApnaBazar</h1><p>Your OTP for ApnaBazar is <b>${otp}</b>. It is valid for 10 minutes. Please do not share it with anyone.</p>`)
        } catch (err) {
            console.log("Error sending OTP email:", err);
            return res.status(500).json({ message: "Failed to send OTP email" })
        }

        return res.status(200).json({ message: "otp sent successfully" })

    }
    else if (req.body.role == "shopkeeper") {
        let user = await shopkeeperModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: "customer not found with this email" })


        }



        let otp = Math.floor(1000 + Math.random() * 9000);

        let otpExpireTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

        user.otp = await bcrypt.hash(otp.toString(), bcrypt.genSaltSync(10))

        user.otpExpireTime = otpExpireTime

        await user.save()

        try {

            await sendEmail(user.email, user.name, "Your OTP for ApnaBazar", `<h1>OTP for ApnaBazar</h1><p>Your OTP for ApnaBazar is <b>${otp}</b>. It is valid for 10 minutes. Please do not share it with anyone.</p>`)
        } catch (err) {
            console.log("Error sending OTP email:", err);
            return res.status(500).json({ message: "Failed to send OTP email" })
        }

        return res.status(200).json({ message: "otp sent successfully" })

    }





    // return res.json({m:"done"})
}


export const verifyotp = async (req, res, next) => {
    let { email, otp, role } = req.body

    console.log('====================================');
    console.log(email,otp,role);
    console.log('====================================');
    if (role == "customer") {
        console.log("in customer",email);
        
        let user = await customerModel.findOne({ email: email })

        if (!user) {
            return res.json({ message: "invalid user" })
        }

        let result = await bcrypt.compare(otp, user.otp)

        if (result == false) {
            return res.json({ message: "invalid otp" })
        }

        if (Date.now() > (user.otpExpireTime)) {
            return res.json({ message: "otp Expired" })
        }
        if (result == true) {

            user.isVerified = true
            await user.save()
            return res.json({ message: "otp Verifyed", success: true })


        }
    }

    else if (role == "shopkeeper") {
        let user = await shopkeeperModel.findOne({ email: email })
        console.log("in shopkeeper",email);
        
        if (!user) {
            return res.json({ message: "invalid user" })
        }

        let result = await bcrypt.compare(otp, user.otp)

        if (result == false) {
            return res.json({ message: "invalid otp" })
        }

        if (Date.now() > (user.otpExpireTime)) {
            return res.json({ message: "otp Expired" })
        }
        if (result == true) {

            user.isVerified = true
            await user.save()
            return res.json({ message: "otp Verifyed", success: true })


        }
    }




}