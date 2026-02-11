import { Router } from "express";
import shopkeeperModel from "../models/shopkeeper.model.js";
import bcrypt from "bcrypt"

const shopekeeperrouter = Router()
shopekeeperrouter.post('/saveshopekeeper', async (req, res) => {

  try {

    const data = req.body;
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    
    //Check existing email or phone
    const existingShopkeeper = await shopkeeperModel.findOne({
      $or: [
        { email: data.email },
        { phone: data.phone }
      ]
    });

    if (existingShopkeeper) {

      if (existingShopkeeper.email === data.email) {
        return res.json({
          success: false,
          message: "Shopkeeper already exists with this email"
        });
      }

      if (existingShopkeeper.phone === data.phone) {
        return res.json({
          success: false,
          message: "Shopkeeper already exists with this phone"
        });
      }
    }

    
    if (!data.deliverypartners || data.deliverypartners.length === 0) {
      return res.json({
        success: false,
        message: "At least one delivery partner is required"
      });
    }

    
    const hashedPassword = await bcrypt.hash(data.password, 10);


    const newShopkeeper = new shopkeeperModel({

      email: data.email,
      name: data.fullname,
      shopname: data.shopName,
      password: hashedPassword,
      phone: data.phone,

      shopaddress: {
        area: data.area,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        location: {
          type: "Point",
          coordinates: [data.latLong.long, data.latLong.lat] // [longitude, latitude]
        }
      },

      deliverypartners: data.deliverypartners.map((d) => ({
        name: d.name,
        email: d.email,
        phone: d.phone
      }))

    });

    await newShopkeeper.save();

    return res.json({
      success: true,
      message: "Shopkeeper registered successfully"
    });

  } catch (error) {

    console.error(error);

    return res.json({
      success: false,
      message: "Internal server error"
    });
  }

});

export default shopekeeperrouter