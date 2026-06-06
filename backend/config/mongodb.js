import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>{
            console.log("DB Connected");
        })
        const uri = process.env.MONGODB_URI || "";
        let connectionUri;
        if (uri.includes('?')) {
            const [base, query] = uri.split('?');
            connectionUri = base.endsWith('/') ? `${base}e-commerce?${query}` : `${base}/e-commerce?${query}`;
        } else {
            connectionUri = uri.endsWith('/') ? `${uri}e-commerce` : `${uri}/e-commerce`;
        }
        
        // Disable buffering to fail fast if DB is offline
        await mongoose.connect(connectionUri, {
            bufferCommands: false,
        })
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        console.log("Backend start continues, but database status is OFFLINE.");
    }
}

export default connectDB;