import { shopkeeperModel } from "../models/shopkeeper.model.js"

export const getshops = async (req, res) => {

    let { latitude, longitude } = req.body

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
    console.log("shops found:", shops);


    if (!shops || shops.length === 0) {
        return res.status(404).json({ message: "No shops found nearby", success: false })
    }

    return res.status(200).json({ message: "Shops retrieved successfully", shops, success: true })
}