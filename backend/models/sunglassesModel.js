import mongoose from "mongoose";

const sunglassesSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    
    // High-resolution asset pipeline
    images: [{
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false }
    }],
    
    // DeepAR Integration Assets
    deeparAssetUrl: { type: String, default: "" }, // URL to the .deepar file (optional for Universal AR)
    
    // Face Anchor Offsets for precise AR placement
    faceAnchors: {
        translation: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 0 }
        },
        rotation: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 0 }
        },
        scale: {
            x: { type: Number, default: 1 },
            y: { type: Number, default: 1 },
            z: { type: Number, default: 1 }
        }
    },
    
    // Metadata & Classification
    category: { type: String, default: "Sunglasses", index: true },
    frameType: { type: String, enum: ['Aviator', 'Wayfarer', 'Round', 'Square', 'Cat-Eye', 'Sport'], required: true },
    faceShapeRecommendation: [{ type: String, enum: ['Oval', 'Round', 'Square', 'Heart', 'Diamond'] }],
    
    // Commercial Logic
    stockQuantity: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    // Multi-currency support (Optional logic placeholder)
    localization: {
        en: { description: String },
        es: { description: String }
    }
}, { timestamps: true });

// Compound index for optimized boutique browsing
sunglassesSchema.index({ brand: 1, price: 1 });
sunglassesSchema.index({ frameType: 1, isActive: 1 });

const sunglassesModel = mongoose.models.sunglasses || mongoose.model("sunglasses", sunglassesSchema);

export default sunglassesModel;
