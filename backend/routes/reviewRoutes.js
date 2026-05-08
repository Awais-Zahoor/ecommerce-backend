import express from 'express';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const reviewRouter = express.Router();

// Public route to get reviews
reviewRouter.get('/:id/reviews', getReviews);

// Protected route to add review
reviewRouter.post('/:id/reviews', authUser, addReview);

// Delete review (Admin or User)
reviewRouter.delete('/:id/reviews/:reviewId', adminAuth, deleteReview);

export default reviewRouter;
