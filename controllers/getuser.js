import mongoose from "mongoose"
import { customerModel } from "../models/customer.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import jwt from "jsonwebtoken"
export const getuser = async (req, res, next) => {
    console.log("at list hitig getuser")
    
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    let {token}=req.body


    let decoded=jwt.verify(token,process.env.secret)

    return res.json({success:true,user:decoded})

} 