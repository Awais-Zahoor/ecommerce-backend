import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:Array, required:true},
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    sizes: {type:Array, required:true},
    brand: {type:String, required:true},
    colors: {type:Array, required:true},
    profession: {type:String, default: "General"},
    inStock: {type:Boolean, default:true},
    stockQuantity: {type:Number, default: 0},
    bestseller: {type:Boolean},
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            name: String,
            rating: Number,
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {type:Number, required:true},
})

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel