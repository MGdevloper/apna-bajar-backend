import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  email:{

    type:String,
    required:true,
    unique:true,
    index:true
  },

  name:{

    type:String,
    required:true,
     unique:true
  },
  password:{
    type:String,
    required:true
    
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
  otp:{
    type:String,
    
  },
  otpExpireTime:{
    type:Number
  },

  address: {
    house: { type: String, trim: true },
    area: { type: String, trim: true },
    landmark: { type: String, trim: true },
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

  createdAt: {
    type: Date,
    default: Date.now
  }

  ,
  resetpassotp:{
    type:String,
    
  },
  restotpExpireTime:{
    type:Number
  },

});


CustomerSchema.index({ "address.location": "2dsphere" });

export const customerModel=mongoose.model("Customer", CustomerSchema);
