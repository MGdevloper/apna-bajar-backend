import mongoose from "mongoose";
import { deliverypartnerschema } from "./deliverypartner.model.js";
const ShopkeeperSchema = new mongoose.Schema({
  email: {

    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  name: {

    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shopname: {

    type: String,
    required: true,
    trim: true

  },

  password: {
    type: String,
    required: true

  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,


  },
  otpExpireTime: {
    type: Number
  },

  shopaddress: {
    area: { type: String, trim: true },

    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],   // [longitude, latitude]
        required: true
      }
    }
  },

  deliverypartners: {
    type: [deliverypartnerschema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetpassotp: {
    type: String,

  },
  restotpExpireTime: {
    type: Number
  },

}, { timestamps: true });


ShopkeeperSchema.index({ "shopaddress.location": "2dsphere" });

export const shopkeeperModel = mongoose.model("Shopkeeper", ShopkeeperSchema);
