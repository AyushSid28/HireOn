import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGO_URL = process.env.MONGO_URI;

const connectDB = async()=>{
  try{
    const connectionInstance = await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch(err){
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); 
  }
}

export default connectDB;