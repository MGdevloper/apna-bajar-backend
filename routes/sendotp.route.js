import { sendotp, verifyotp } from "../controllers/otp.js";

import { Router } from "express";

let sendotproute=Router()
let verifyotproute=Router()

sendotproute.post("/sendotp",(req,res,next)=>{
    sendotp(req,res,next)
})

verifyotproute.post("/verifyotp",(req,res,next)=>{
    verifyotp(req,res,next)
})

export {verifyotproute}
 
export default sendotproute