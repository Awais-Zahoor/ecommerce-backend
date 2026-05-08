import mongoose from "mongoose";

const sunglassesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    model3D: { type: String, required: true }, // Strictly required now
    category: { type: String, default: "sunglasses" }, // Always sunglasses
    brand: { type: String, default: "Awais Luxe" },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            name: String,
            rating: Number,
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Number, required: true }
})

const sunglassesModel = mongoose.models.sunglasses || mongoose.model("sunglasses", sunglassesSchema);

export default sunglassesModel;
