import mongoose from "mongoose";

const oldUri = "mongodb+srv://awaisniazi:Ctx38uwE00fREklh@cluster0.tmzeshe.mongodb.net/e-commerce";
const newUri = "mongodb+srv://awaiszahoords_db_user:rkPwLt4VNkg1rw3g@cluster0.n0iigcj.mongodb.net/e-commerce?appName=Cluster0";

const collectionsToMigrate = [
    "sunglasses",
    "users",
    "discounts",
    "products",
    "brandings",
    "orders",
    "subscribers",
    "inquiries"
];

async function migrate() {
    let oldConn, newConn;
    try {
        console.log("Connecting to OLD database...");
        oldConn = await mongoose.createConnection(oldUri).asPromise();
        console.log("Connected to OLD database.");

        console.log("Connecting to NEW database...");
        newConn = await mongoose.createConnection(newUri).asPromise();
        console.log("Connected to NEW database.");

        for (const colName of collectionsToMigrate) {
            console.log(`\nMigrating collection: ${colName}...`);
            
            // Fetch all documents from old database
            const oldDocs = await oldConn.db.collection(colName).find({}).toArray();
            console.log(`Found ${oldDocs.length} documents in old database.`);

            // Delete existing documents in new database to avoid duplicates
            const deleteResult = await newConn.db.collection(colName).deleteMany({});
            console.log(`Cleared ${deleteResult.deletedCount} existing documents in new database.`);

            if (oldDocs.length > 0) {
                // Insert the documents
                const insertResult = await newConn.db.collection(colName).insertMany(oldDocs);
                console.log(`Inserted ${insertResult.insertedCount} documents into new database.`);
            } else {
                console.log(`Skipping insert for ${colName} as it has 0 documents.`);
            }
        }

        console.log("\nMigration completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        if (oldConn) await oldConn.close();
        if (newConn) await newConn.close();
    }
}

migrate();
