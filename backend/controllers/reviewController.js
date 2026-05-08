import productModel from "../models/productModel.js";
import sunglassesModel from "../models/sunglassesModel.js";
import userModel from "../models/userModel.js";

// Add Review
const addReview = async (req, res) => {
    try {
        const { rating, comment, userId } = req.body;
        const { id } = req.params;
        const { type } = req.query; // 'product' or 'sunglasses'

        const model = type === 'sunglasses' ? sunglassesModel : productModel;
        const product = await model.findById(id);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.json({ success: false, message: "You already reviewed this product" });
        }

        const user = await userModel.findById(userId);

        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: userId,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.json({ success: true, message: "Review submitted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Reviews
const getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query;

        const model = type === 'sunglasses' ? sunglassesModel : productModel;
        const product = await model.findById(id);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, reviews: product.reviews });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Review
const deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        const { type } = req.query;

        const model = type === 'sunglasses' ? sunglassesModel : productModel;
        const product = await model.findById(id);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        product.reviews = product.reviews.filter(
            (r) => r._id.toString() !== reviewId.toString()
        );

        product.numReviews = product.reviews.length;
        
        if (product.reviews.length > 0) {
            product.ratings =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
        } else {
            product.ratings = 0;
        }

        await product.save();
        res.json({ success: true, message: "Review deleted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addReview, getReviews, deleteReview }
