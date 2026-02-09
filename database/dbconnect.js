import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
async function dbconnect() {

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");
        
        
        
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}


export default dbconnect;