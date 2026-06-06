import mongoose from 'mongoose';
import 'dotenv/config';

async function cleanupIndexes() {
    try {
        const uri = process.env.MONGODB_URI || "";
        let connectionUri;
        if (uri.includes('?')) {
            const [base, query] = uri.split('?');
            connectionUri = base.endsWith('/') ? `${base}e-commerce?${query}` : `${base}/e-commerce?${query}`;
        } else {
            connectionUri = uri.endsWith('/') ? `${uri}e-commerce` : `${uri}/e-commerce`;
        }
        await mongoose.connect(connectionUri);
        console.log("Connected to MongoDB for cleanup...");
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        const subscriberColl = collections.find(c => c.name === 'subscribers');
        
        if (subscriberColl) {
            console.log("Dropping redundant email index from subscribers...");
            try {
                await mongoose.connection.db.collection('subscribers').dropIndex('email_1');
                console.log("Index 'email_1' dropped successfully.");
            } catch (e) {
                console.log("Index 'email_1' not found or already dropped.");
            }
        }
        
        await mongoose.disconnect();
        console.log("Cleanup complete.");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanupIndexes();
