// @ts-nocheck
// @ts-ignore
import { shopkeeperModel } from "../models/shopkeeper.model.js";
import jwt from "jsonwebtoken"
import { io } from "../index.js";
// @ts-ignore
export async function getShopOpenCloseStatus(req, res) {

    let token=req.body.token

    let decoded=jwt.verify(token,process.env.secret)
    
    console.log(decoded);
    try{

        let user=await shopkeeperModel.findById(decoded.id)
        
        return user? res.json({success:true,isShopOpen:user.isShopOpen}):res.json({success:false,message:"User not found"})
    }catch(err){
        return res.json({success:false,message:"Invalid token"})
    }

}

export async function updateShopOpenCloseStatus(req, res) {

    let token=req.body.token
    let isShopOpen=req.body.isShopOpen




    let decoded=jwt.verify(token,process.env.secret)
    
    console.log(decoded);

    try{
        let user=await shopkeeperModel.findByIdAndUpdate(decoded.id,{isShopOpen}, { new: true })

        io.emit("shop_status_changed", { shopkeeperId: decoded.id, isShopOpen })
        return user? res.json({success:true,isShopOpen:user.isShopOpen}):res.json({success:false,message:"User not found"})
    }
    catch(err){
        return res.json({success:false,message:"Invalid token"})
     }  


}