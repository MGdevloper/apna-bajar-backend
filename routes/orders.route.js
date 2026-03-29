import { Router } from "express";
import { getorders, getCustomerOrders, placeorder, updateOrderStatus } from "../controllers/orders.js";


const ordersRouter = Router()

ordersRouter.post("/placeorder", placeorder)
ordersRouter.post("/getorders",getorders)
ordersRouter.post("/getcustomerorders", getCustomerOrders)
ordersRouter.post("/updateorderstatus", updateOrderStatus)


export default ordersRouter
