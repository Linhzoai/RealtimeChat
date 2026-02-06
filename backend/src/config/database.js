import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function connectDB(){
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}
export default connectDB;