import { Router } from "express";
import { getshops } from "../controllers/getshops.js";
const shopsrouter = Router()

shopsrouter.post("/getshops", getshops)

export default shopsrouter  