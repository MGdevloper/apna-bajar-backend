import { deliverypartnerotpverify } from "../controllers/otp.js";

import { Router } from "express";
let deliverypartnerverifyroute = Router()


deliverypartnerverifyroute.post("/deliverypartnerotpverify",(req,res,next)=>{
    deliverypartnerotpverify(req,res,next)
})

export default deliverypartnerverifyroute//