import { io } from "../index.js";
import jwt from "jsonwebtoken";
import { customerModel } from "../models/customer.model.js";
import orderModel from "../models/orders.model.js";

const buildOrderNumber = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `APNA-${Date.now()}-${randomSuffix}`;
};

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    return (
        req.body?.token ||
        req.body?.customerId ||
        req.body?.shopkeeperId ||
        req.query?.token ||
        req.query?.customerId ||
        req.query?.shopkeeperId ||
        bearerToken ||
        ""
    );
};

export const placeorder = async (req, res) => {
    try {
        const orders = req.body?.order || {};
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const payload = jwt.verify(token, process.env.secret);
        // @ts-ignore
        const customerID = payload.id;

        const customer = await customerModel.findById(customerID);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const customerName = customer.name;
        const createdOrders = [];

        for (const shopid in orders) {
            const orderdetails = orders[shopid];

            const neworder = new orderModel({
                orderNumber: buildOrderNumber(),
                customerId: customerID,
                shopkeeperId: shopid,
                customerName,
                items: orderdetails.items,
                total: orderdetails.total,
                status: "pending"
            });

            await neworder.save();
            createdOrders.push(neworder);

            io.to(String(shopid)).emit("new_order", neworder);
            io.to(String(customerID)).emit("new_order", neworder);
        }

        return res.status(200).json({
            message: "Order placed successfully",
            success: true,
            orders: createdOrders
        });
    }
    catch (err) {
        console.error("placeorder failed:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }




}

export const getorders = async (req, res) => {

    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const payload = jwt.verify(token, process.env.secret);
        // @ts-ignore
        const shopkeeperId = payload.id;

        const orders = await orderModel
            .find({ shopkeeperId })
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

}

export const getCustomerOrders = async (req, res) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const payload = jwt.verify(token, process.env.secret);
        // @ts-ignore
        const customerId = payload.id;

        const orders = await orderModel
            .find({ customerId })
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

}

export const updateOrderStatus = async (req, res) => {
    try {
        const token = getTokenFromRequest(req);
        const { orderId, status } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "orderId and status are required" });
        }

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const payload = jwt.verify(token, process.env.secret);
        // @ts-ignore
        const shopkeeperId = payload.id;

        const updatedOrder = await orderModel.findOneAndUpdate(
            { _id: orderId, shopkeeperId },
            { $set: { status } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        io.to(String(updatedOrder.shopkeeperId)).emit("order_status_updated", updatedOrder);
        io.to(String(updatedOrder.customerId)).emit("order_status_updated", updatedOrder);

        return res.json({ success: true, order: updatedOrder });
    }
    catch (err) {
        console.error("updateOrderStatus failed:", err);
        return res.status(500).json({ success: false, message: "Failed to update order status" });
    }

}