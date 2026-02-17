import express from 'express'
import dotenv from 'dotenv'
import dbconnect from './database/dbconnect.js'
import customersaveroute from './routes/savecustomer.route.js'
import sendotproute from './routes/sendotp.route.js'
import { verifyotproute } from './routes/sendotp.route.js'
import shopekeeperrouter from './routes/saveshopekeeper.route.js'

import forgotpassword from './routes/forgotpassword.route.js'
dotenv.config()



const app=express()
app.use(express.json())

app.use(customersaveroute)
app.use(shopekeeperrouter)
app.use(sendotproute)
app.use(verifyotproute)
app.use(forgotpassword)
app.listen(process.env.PORT,()=>{
    dbconnect();
    console.log("http://localhost:"+process.env.PORT);
    
})