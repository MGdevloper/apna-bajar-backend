import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  email:{

    type:String,
    required:true,
    unique:true
  },

  name:{

    type:String,
    required:true,
     unique:true
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

});


CustomerSchema.index({ "address.location": "2dsphere" });

export default mongoose.model("Customer", CustomerSchema);
