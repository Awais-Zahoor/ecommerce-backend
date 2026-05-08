import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const AdminReviews = ({ productId, type, reviews, onReviewDeleted }) => {
    
    const deleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${backendUrl}/api/${type}/${productId}/reviews/${reviewId}`,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Review deleted");
                if (onReviewDeleted) onReviewDeleted();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div className='space-y-6 animate-reveal'>
            <div className='flex items-center gap-3 mb-8'>
                <span className='w-2 h-2 bg-rose-500 rounded-full animate-pulse'></span>
                <p className='text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]'>Customer Reviews Management</p>
            </div>

            {reviews.length === 0 ? (
                <div className='py-20 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>No reviews found for this masterpiece</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-4'>
                    {reviews.map((review) => (
                        <div key={review._id} className='bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-start group hover:border-rose-200 dark:hover:border-rose-900/50 transition-all'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-3'>
                                    <p className='text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white'>{review.name}</p>
                                    <div className='flex gap-0.5'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-[10px] ${i < review.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic'>"{review.comment}"</p>
                                <p className='text-[9px] font-bold text-gray-400 uppercase tracking-tighter'>{new Date(review.createdAt).toLocaleString()}</p>
                            </div>
                            <button 
                                onClick={() => deleteReview(review._id)}
                                className='p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all'
                                title="Delete Review"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
