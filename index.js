import express from 'express'
import dotenv from 'dotenv'
import dbconnect from './database/dbconnect.js'
import customersaveroute from './routes/savecustomer.route.js'
import sendotproute from './routes/sendotp.route.js'
import { verifyotproute } from './routes/sendotp.route.js'
import shopekeeperrouter from './routes/saveshopekeeper.route.js'
import deliverypartnerverifyroute from './routes/verifydeliverypartner.route.js'
import cors from "cors"

import loginroute from './routes/login.route.js'

import forgotpassword from './routes/forgotpassword.route.js'
dotenv.config()



const app = express()
app.use(express.json())
app.use(cors({
    origin: "*", // or limit to your frontend origin, e.g. "http://localhost:5173"
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}))
app.use(customersaveroute)
app.use(shopekeeperrouter)
app.use(sendotproute)
app.use(verifyotproute)
app.use(forgotpassword)
app.use(loginroute)
app.use(deliverypartnerverifyroute)
app.listen(Number(process.env.PORT),"0.0.0.0",()=>{
    dbconnect();
    console.log(`http://${process.env.SERVER_IP}:` + process.env.PORT);

})
