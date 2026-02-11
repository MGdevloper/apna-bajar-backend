import mongoose from "mongoose";

const deliverypartnerschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    phone: {

        type: String,
        required: true,
        uniqe: true
    },
    email: {
        type: String,
        required: true,
        uniqe: true
    },
    otp: {
        type: String,

    },
    otpExpireTime: {
        type: Number
    },


})

export const DeliveryPartnerModel=mongoose.model('DeliveryPartner',deliverypartnerschema)
export {deliverypartnerschema}