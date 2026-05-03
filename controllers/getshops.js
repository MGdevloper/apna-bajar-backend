import { shopkeeperModel } from "../models/shopkeeper.model.js"
import jwt from "jsonwebtoken"
// @ts-ignore
export const getshops = async (req, res) => {

    let { latitude, longitude } = req.body.location
    let decode = req.body.token
    // @ts-ignore
    let decoded = jwt.verify(decode, process.env.secret)
    
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized", success: false })
    }

    let shops = await shopkeeperModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "distance",
                maxDistance: 5000,

            }
        }
    ])

    if (!shops || shops.length === 0) {
        return res.status(200).json({ message: "No shops found nearby", success: false })
    }

    return res.status(200).json({ message: "Shops retrieved successfully", shops, success: true })
}