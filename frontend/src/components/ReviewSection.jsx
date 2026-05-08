import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

const ReviewSection = forwardRef(({ productId, type, initialReviews = [], initialRating = 0, initialNumReviews = 0 }, ref) => {
    const { backendUrl } = useContext(ShopContext);
    const [reviews, setReviews] = useState(initialReviews);
    const [avgRating, setAvgRating] = useState(initialRating);
    const [numReviews, setNumReviews] = useState(initialNumReviews);
    const [highlight, setHighlight] = useState(false);
    
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    useImperativeHandle(ref, () => ({
        scrollToSection: () => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            setHighlight(true);
            setTimeout(() => {
                setHighlight(false);
                formRef.current?.focus();
            }, 800);
        }
    }));

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/${type}/${productId}/reviews`);
            if (response.data.success) {
                const sortedReviews = response.data.reviews.reverse();
                setReviews(sortedReviews);
                
                // Recalculate avg if not provided by parent or for fresh sync
                if (sortedReviews.length > 0) {
                    const total = sortedReviews.reduce((acc, r) => acc + r.rating, 0);
                    setAvgRating(total / sortedReviews.length);
                    setNumReviews(sortedReviews.length);
                } else {
                    setAvgRating(0);
                    setNumReviews(0);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, type]);

    return (
        <div ref={sectionRef} className={`mt-20 border-t border-gray-100 dark:border-gray-900 pt-20 scroll-mt-32 transition-all duration-700 ${highlight ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
                
                {/* Left Side: Summary & Form */}
                <div className='space-y-12'>
                    <div>
                        <h3 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Customer Feedback</h3>
                        <div className='flex items-center gap-4 mt-4'>
                            <StarRating rating={Math.round(avgRating)} size="w-6 h-6" />
                            <p className='text-xl font-black text-gray-900 dark:text-white'>{avgRating.toFixed(1)}</p>
                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Based on {numReviews} reviews</p>
                        </div>
                    </div>

                    <ReviewForm ref={formRef} productId={productId} type={type} onReviewAdded={fetchReviews} />
                </div>

                {/* Right Side: Reviews List */}
                <div className='space-y-8'>
                    {reviews.length === 0 ? (
                        <div className='h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800'>
                            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className='space-y-6 max-h-[700px] overflow-y-auto pr-4 no-scrollbar'>
                            {reviews.map((review, index) => (
                                <div key={review._id || index} className='p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all animate-fadeIn' style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className='flex justify-between items-start mb-3'>
                                        <div>
                                            <p className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight'>{review.name}</p>
                                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <StarRating rating={review.rating} size="w-4 h-4" />
                                    </div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ReviewSection;
