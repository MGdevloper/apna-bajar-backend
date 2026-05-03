import express from 'express'
import dotenv from 'dotenv'
import http from "http"
import { Server } from "socket.io"

import dbconnect from './database/dbconnect.js'
import customersaveroute from './routes/savecustomer.route.js'
import sendotproute from './routes/sendotp.route.js'
import { verifyotproute } from './routes/sendotp.route.js'
import shopekeeperrouter from './routes/saveshopekeeper.route.js'
import deliverypartnerverifyroute from './routes/verifydeliverypartner.route.js'
import getprofileroute from './routes/getprofile.js'
import shopsrouter from './routes/shops.router.js'
import cors from "cors"
import cart from './routes/carts.route.js'
import loginroute from './routes/login.route.js'
import forgotpassword from './routes/forgotpassword.route.js'
import getuserroute from './routes/getuser.route.js'
import products from './routes/products.route.js'
import ordersRouter from './routes/orders.route.js'
import jwt from "jsonwebtoken"
import ShopOpenCloseRoute from './routes/shopopencloseroute.js'
dotenv.config()

const app = express()

// 🔥 IMPORTANT → create server
const server = http.createServer(app)

// 🔥 socket setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// middleware
app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}))

// routes
app.use(customersaveroute)
app.use(shopekeeperrouter)
app.use(sendotproute)
app.use(verifyotproute)
app.use(forgotpassword)
app.use(loginroute)
app.use(deliverypartnerverifyroute)
app.use(getuserroute)
app.use(getprofileroute)
app.use(products)  
app.use(shopsrouter)
app.use(cart)
app.use(ordersRouter)
app.use(ShopOpenCloseRoute)

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {


    // shopkeeper joins room
    socket.on("join_shopkeeper", (token) => {
        try {
            let Pyload = jwt.verify(token, process.env.secret);

            // @ts-ignore
            socket.join(Pyload.id.toString())
        } catch (error) {
            socket.emit("auth_error", "Invalid token")
        }


    })

    // customer joins room
    socket.on("join_customer", (token) => {
        try {
            let Pyload = jwt.verify(token, process.env.secret);
            // @ts-ignore
            socket.join(Pyload.id.toString())
        } catch (error) {
            socket.emit("auth_error", "Invalid token")
        }
    })

    socket.on("join_deliverypartner", (token) => {
        try {
            let Pyload = jwt.verify(token, process.env.secret);
            // @ts-ignore
            socket.join(Pyload.id.toString())
        } catch (error) {
            socket.emit("auth_error", "Invalid token")
        }
    })


    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
    })
})

// 🔥 export io for use in routes
export { io }

// 🔥 use server.listen instead of app.listen
server.listen(Number(process.env.PORT), "0.0.0.0", () => {
    dbconnect();
    console.log(`http://${process.env.SERVER_IP}:` + process.env.PORT);
})