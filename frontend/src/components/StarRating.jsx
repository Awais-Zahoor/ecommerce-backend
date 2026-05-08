import React, { useState } from 'react';

const StarRating = ({ rating, setRating, interactive = false, size = "w-5 h-5" }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const activeRating = hoverRating || rating;

    return (
        <div className='flex items-center gap-1.5'>
            {[1, 2, 3, 4, 5].map((star) => (
                <div
                    key={star}
                    className="relative"
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => interactive && setRating(star)}
                >
                    <svg
                        className={`
                            ${size} transition-all duration-300 ease-out
                            ${interactive ? 'cursor-pointer' : 'cursor-default'}
                            ${star <= activeRating 
                                ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' 
                                : 'text-gray-400 dark:text-gray-600 fill-transparent stroke-[1.5]'
                            }
                            ${interactive && star <= hoverRating ? 'scale-125' : 'scale-100'}
                            ${interactive && star <= rating && !hoverRating ? 'scale-110' : ''}
                        `}
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    
                    {/* Subtle Glow Overlay for Selected Stars */}
                    {star <= rating && (
                        <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full pointer-events-none" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default StarRating;
