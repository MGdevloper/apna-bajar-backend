import { Router } from "express";

let ShopOpenCloseRoute = Router();

import { getShopOpenCloseStatus, updateShopOpenCloseStatus } from "../controllers/shopopenclosestatus.js"


ShopOpenCloseRoute.post("/getopenclosestatus", getShopOpenCloseStatus)

ShopOpenCloseRoute.post("/updateopenclosestatus", updateShopOpenCloseStatus)

export default ShopOpenCloseRoute