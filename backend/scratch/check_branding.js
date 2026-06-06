import mongoose from "mongoose";

const oldUri = "mongodb+srv://awaisniazi:Ctx38uwE00fREklh@cluster0.tmzeshe.mongodb.net/e-commerce";
const newUri = "mongodb+srv://awaiszahoords_db_user:rkPwLt4VNkg1rw3g@cluster0.n0iigcj.mongodb.net/e-commerce?appName=Cluster0";

async function check() {
    try {
        console.log("Connecting to OLD database...");
        const oldConn = await mongoose.createConnection(oldUri).asPromise();
        console.log("Connected to OLD database.");

        const collections = await oldConn.db.listCollections().toArray();
        console.log("\nOLD Database Collections and Document Counts:");
        for (const col of collections) {
            const count = await oldConn.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }

        console.log("\nConnecting to NEW database...");
        const newConn = await mongoose.createConnection(newUri).asPromise();
        console.log("Connected to NEW database.");

        const newCollections = await newConn.db.listCollections().toArray();
        console.log("\nNEW Database Collections and Document Counts:");
        for (const col of newCollections) {
            const count = await newConn.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }

        await oldConn.close();
        await newConn.close();
    } catch (err) {
        console.error("Error checking databases:", err);
    }
}

check();
