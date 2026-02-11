import { Router } from "express";
import customerModel from "../models/customer.model.js";
import bcrypt from "bcrypt"
let customersaveroute = Router()
/*{
  customerData: {
    phone: '7487023234',
    house: 'shreedeep boys hostel',
    area: 'Amphitheatre Parkway, Mountain View, Santa Clara County, California, 94043, United States',
    city: 'Mountain View',
    pincode: '94043',
    landmark: '',
    state: 'California',
    latLong: { lat: 37.421998333333335, long: -122.084 }
  }
} */
customersaveroute.post("/savecustomer", async (req, res, next) => {

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    let { phone, house, area, city, pincode, landmark, state, latLong, fullname, password, email } = req.body;


    //check if customer already exists phone email fullname
    let existingcustomer = await customerModel.findOne({ $or: [{ phone }, { email }, { name: fullname }] })

    if (existingcustomer) {
        
        

        if (existingcustomer.phone === phone) {
            return res.json({ reason: "already exists", message: "customer already exists with same phone" })
        }
        if (existingcustomer.email === email) {


            return res.json({ reason: "already exists", message: "customer already exists with same email" })
        }
        if (existingcustomer.name === fullname) {
            return res.json({ reason: "already exists", message: "customer already exists with same name" })
        }

    }
    
    let passwordHash=await bcrypt.hash(password,bcrypt.genSaltSync(10))

    let newcustomer = new customerModel({

        password:passwordHash,
        name: fullname,
        email,
        phone,
        address: {
            house,
            area,
            city,
            pincode,
            landmark,
            state,
            location: {

                type: "Point",
                coordinates: [latLong.long, latLong.lat]
            }
        }
    })

    await newcustomer.save()
    return res.status(200).json({ message: "customer saved successfully", customer: newcustomer })
})


// 

export default customersaveroute;


