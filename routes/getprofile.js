import { Router } from "express";

import { getProfile, updateProfile } from "../controllers/profile.js";

const getprofileroute = Router()

getprofileroute.post("/getprofile", (req, res, next) => {
    getProfile(req, res, next)
})

getprofileroute.post("/updateprofile", (req, res, next) => {
    updateProfile(req, res, next)
})

export default getprofileroute