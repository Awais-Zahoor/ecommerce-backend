import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import sunglassesModel from "../models/sunglassesModel.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadToCloudinary = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    const sunglasses = await sunglassesModel.find({});
    console.log(`Found ${sunglasses.length} products to process.`);

    for (const product of sunglasses) {
      const localRelativePath = product.image[0];
      
      // Map "/sunglasses/aviator_black.png" to local filesystem path
      // The images are in frontend/public/sunglasses
      const fileName = path.basename(localRelativePath);
      const localFilePath = path.resolve(__dirname, "../../frontend/public/sunglasses", fileName);

      if (fs.existsSync(localFilePath)) {
        console.log(`Uploading ${fileName} for ${product.name}...`);
        
        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: "sunglasses",
          resource_type: "image"
        });

        product.image = [result.secure_url];
        await product.save();
        
        console.log(`✅ Success: ${product.name} updated with Cloudinary URL.`);
      } else {
        console.warn(`⚠️ Warning: Local file not found at ${localFilePath}`);
      }
    }

    console.log("All products updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during upload:", error);
    process.exit(1);
  }
};

uploadToCloudinary();
