import { forgotpassswordemailsend,forgotpassverifyotp ,updatepassword} from "../controllers/forgotpassword.js";

import { Router } from "express";

let forgotpassword=Router()


forgotpassword.post("/forgotpass_sendemail",(req,resizeBy,next)=>{
    forgotpassswordemailsend(req,resizeBy,next)
})


forgotpassword.post("/forgotpass_otpverify",(req,res,next)=>{

    forgotpassverifyotp(req,res,next)
})

forgotpassword.post("/updatepassword",(req,res,next)=>{
    updatepassword(req,res,next)
})
export default forgotpassword