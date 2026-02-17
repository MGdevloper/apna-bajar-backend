import mongoose from "mongoose";
import { customerModel } from "../models/customer.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import sendEmail from "../utils/sendmail.js";
import bcrypt from "bcrypt"

async function sendmail(res, user) {
    console.log(user);

    let otp = Math.floor(1000 + Math.random() * 9000);

    let otpExpireTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    user.resetpassotp = await bcrypt.hash(otp.toString(), bcrypt.genSaltSync(10))

    user.restotpExpireTime = otpExpireTime

    await user.save()
    console.log('====================================');
    console.log(user);
    console.log('====================================');

    try {


        await sendEmail(user.email, user.name, "Reset password otp", `<h1>OTP for ApnaBazar</h1><p>Your OTP for Reset Password is <b>${otp}</b>. It is valid for 10 minutes. Please do not share it with anyone.</p>`)

        return res.json({ message: "Email sent successfully", success: true })


    } catch (err) {

        return res.json({ message: "server Error", success: false })

    }
}
export const forgotpassswordemailsend = async (req, res, next) => {


    let { email } = req.body

    console.log(email);



    let user = await customerModel.findOne({ email })

    if (user) {
        console.log("from customer");
        return sendmail(res, user)

    }


    else if (!user) {


        user = await shopkeeperModel.findOne({ email })
        if (user) {

            console.log("from shopkeeper");
            return sendmail(res, user)
        }

        if (!user) {
            return res.json({ message: "email not exist", success: false })


        }
    }








}


export const forgotpassverifyotp = async (req, res, next) => {
    let { otp, email } = req.body

    console.log("otp,email", { otp, email });



    let user = await customerModel.findOne({ email })


    if (!user) {
        let user = await shopkeeperModel.findOne({ email })
        if (Date.now() > user.restotpExpireTime) {
            return res.json({ message: "otp time exprid", success: false })
        }
        console.log('====================================');
        console.log("otp", otp);
        console.log('====================================');
        let result = await bcrypt.compare(otp, user.resetpassotp)
        console.log("result", result);


        if (result == true) {

            return res.json({ message: "otp verifyed✅", success: true })
        }

        else {
            return res.json({ message: "otp not matched", success: false })
        }


    }


    else if (user) {

        if (Date.now() > user.restotpExpireTime) {
            return res.json({ message: "otp time exprid", success: false })
        }

        let result = await bcrypt.compare(otp, user.resetpassotp)


        if (result == true) {

            return res.json({ message: "otp verifyed✅", success: true })
        }

        else {
            return res.json({ message: "otp not matched", success: false })
        }
    }
    else {
        return res.json({ message: "email not exist", success: false })
    }




}

export const updatepassword=async(req,res,next)=>{
    let{newPassword,confirmPassword,email}=req.body

    console.log("newpassword,confirmpassword,email",newPassword,confirmPassword,email);

    if(newPassword!=confirmPassword){
        return res.json({message:"confirmPassword and newpassword not matched!",success:true})
    }
    
    let user=await customerModel.findOne({email})|| await shopkeeperModel.findOne({email})

    if(!user){
        return res.json({success:false,message:"user not exist"})


    }

    user.password=await bcrypt.hash(newPassword,bcrypt.genSaltSync(10))
    user.save()

    return res.json({success:true,message:"password update successfully ✅"})
}