import { Router } from "express";
import { getuser } from "../controllers/getuser.js";

const getuserroute = Router()

getuserroute.post("/getuser", (req, res, next) => {
    getuser(req, res, next)
})

export default getuserroute             
