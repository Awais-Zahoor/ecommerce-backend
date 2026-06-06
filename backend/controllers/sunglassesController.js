import sunglassesModel from "../models/sunglassesModel.js";
import { v2 as cloudinary } from 'cloudinary';

// Add Sunglasses (Admin)
const addSunglasses = async (req, res) => {
    try {
        const { 
            name, brand, description, price, frameType, 
            faceAnchors, faceShapeRecommendation, stockQuantity, isBestseller 
        } = req.body;

        // Assets extraction
        const imageFiles = req.files?.images;
        const deeparFile = req.files?.deeparAsset?.[0];

        // Upload images to Cloudinary
        const imageUrls = [];
        if (imageFiles) {
            for (const file of imageFiles) {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                imageUrls.push({ url: result.secure_url, isPrimary: imageUrls.length === 0 });
            }
        }

        // Upload 3D model (.glb) to Cloudinary (raw resource)
        let deeparAssetUrl = "";
        if (deeparFile) {
            const deeparResult = await cloudinary.uploader.upload(deeparFile.path, { resource_type: 'raw' });
            deeparAssetUrl = deeparResult.secure_url;
        }

        const sunglassesData = {
            name, brand, description, price: Number(price),
            frameType,
            images: imageUrls,
            deeparAssetUrl: deeparAssetUrl,
            faceAnchors: JSON.parse(faceAnchors || '{}'),
            faceShapeRecommendation: JSON.parse(faceShapeRecommendation || '[]'),
            stockQuantity: Number(stockQuantity),
            isBestseller: isBestseller === 'true'
        };

        const sunglasses = new sunglassesModel(sunglassesData);
        await sunglasses.save();

        res.json({ success: true, message: "Luxury Sunglasses added successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Sunglasses (Public/Boutique)
const listSunglasses = async (req, res) => {
    try {
        // Optimized query with projection and lean
        const sunglasses = await sunglassesModel.find({ isActive: true })
            .select('name brand price images frameType faceShapeRecommendation isBestseller deeparAssetUrl faceAnchors')
            .lean()
            .sort({ createdAt: -1 });

        res.json({ success: true, sunglasses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Single Sunglasses Details
const singleSunglasses = async (req, res) => {
    try {
        const { id } = req.params;
        const sunglasses = await sunglassesModel.findById(id).lean();
        
        if (!sunglasses) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        res.json({ success: true, sunglasses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Sunglasses
const updateSunglasses = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Handle nested faceAnchors update if provided
        if (updateData.faceAnchors && typeof updateData.faceAnchors === 'string') {
            updateData.faceAnchors = JSON.parse(updateData.faceAnchors);
        }

        const updated = await sunglassesModel.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "Updated successfully", updated });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Sunglasses
const removeSunglasses = async (req, res) => {
    try {
        await sunglassesModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Masterpiece removed from archive" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addSunglasses, listSunglasses, singleSunglasses, updateSunglasses, removeSunglasses };
