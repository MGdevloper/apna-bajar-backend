import mongoose from "mongoose"
import { customerModel } from "../models/customer.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import jwt from "jsonwebtoken"
export const getuser = async (req, res) => {
    
    
    let {token}=req.body

    try{

        let decoded=jwt.verify(token,process.env.secret)
    
        return res.json({success:true,user:decoded})
    }
    catch(err){
        return res.json({success:false,message:"Invalid token"})
    }
} 