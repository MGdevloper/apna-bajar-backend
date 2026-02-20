import { Router } from "express";
import { Login } from "../controllers/login.js";
import { deliverypartnerLogin } from "../controllers/login.js";
let loginroute = Router()

loginroute.post("/login", Login)
loginroute.post("/deliverypartnerlogin", deliverypartnerLogin)
export default loginroute