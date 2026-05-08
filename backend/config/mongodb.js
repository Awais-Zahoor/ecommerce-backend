import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>{
            console.log("DB Connected");
        })
        // Disable buffering to fail fast if DB is offline
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
            bufferCommands: false,
        })
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        console.log("Backend start continues, but database status is OFFLINE.");
    }
}

export default connectDB;