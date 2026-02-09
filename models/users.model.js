import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    
      name:{
        type:String,
        required:true,
      },
      phone:{
        type:String,
        required:true,
        length:10,
        unique:true,
      },
      email:{
        type:String,
        required:true,
        unique:true,
      },
      password:{
        type:String,
        required:true,
      },
      role:{
        type:String,
        required:true,
        enum:['customer','shopkeeper','deliverypartner'],
      },
      isActive:{
        type:Boolean,
        default:false,   
      },
      
},{timestamps:true})

const Usermodel = mongoose.model('User', userSchema);

export default Usermodel;