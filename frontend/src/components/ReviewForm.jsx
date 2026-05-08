import React, { useState, useContext, forwardRef } from 'react';
import StarRating from './StarRating';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewForm = forwardRef(({ productId, type, onReviewAdded }, ref) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            return toast.error("Please login to add review");
        }
        if (rating === 0) {
            return toast.error("Please select a rating");
        }
        if (comment.trim().length < 10) {
            return toast.error("Comment must be at least 10 characters");
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${backendUrl}/api/${type}/${productId}/reviews`, 
                { rating, comment }, 
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Review submitted successfully");
                setRating(0);
                setComment("");
                if (onReviewAdded) onReviewAdded();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6 bg-gray-50/50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fadeIn'>
            <div className='space-y-2'>
                <p className='text-xs font-black uppercase tracking-widest text-gray-400'>Select Rating</p>
                <StarRating rating={rating} setRating={setRating} interactive={true} size="w-8 h-8" />
            </div>

            <div className='space-y-2'>
                <p className='text-xs font-black uppercase tracking-widest text-gray-400'>Your Experience</p>
                <textarea
                    ref={ref}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]'
                    placeholder="Share your thoughts about this product..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                    loading 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'
                }`}
            >
                {loading ? "Submitting..." : "Post Review"}
            </button>
        </form>
    );
});

export default ReviewForm;
