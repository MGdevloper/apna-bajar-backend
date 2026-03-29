import { Router } from "express";
import {
	assignDeliveryPartner,
	getorders,
	getCustomerOrders,
	getDeliveryPartnerOrders,
	placeorder,
	updateDeliveryLocation,
	updateDeliveryOrderStatus,
	updateOrderStatus
} from "../controllers/orders.js";


const ordersRouter = Router()

ordersRouter.post("/placeorder", placeorder)
ordersRouter.post("/getorders",getorders)
ordersRouter.post("/getcustomerorders", getCustomerOrders)
ordersRouter.post("/updateorderstatus", updateOrderStatus)
ordersRouter.post("/assigndeliverypartner", assignDeliveryPartner)
ordersRouter.post("/getdeliverypartnerorders", getDeliveryPartnerOrders)
ordersRouter.post("/updatedeliveryorderstatus", updateDeliveryOrderStatus)
ordersRouter.post("/updatedeliverylocation", updateDeliveryLocation)


export default ordersRouter
