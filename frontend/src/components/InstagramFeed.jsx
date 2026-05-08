import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const InstagramFeed = () => {
    const { branding } = useContext(ShopContext);

    let feeds = [
        { image: assets.insta_1, likes: '1.2k', comments: '45' },
        { image: assets.insta_2, likes: '2.5k', comments: '128' },
        { image: assets.insta_3, likes: '890', comments: '32' },
        { image: assets.insta_1, likes: '1.5k', comments: '67' } // Reusing for variety
    ];

    if (branding?.instagramFeed && branding.instagramFeed.length > 0) {
        feeds = feeds.map((item, i) => {
            const bFeed = branding.instagramFeed[i] || {};
            return {
                image: bFeed.image || item.image,
                likes: bFeed.likes || item.likes,
                comments: bFeed.comments || item.comments
            };
        });
    }

    return (
        <div className='my-24 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <div className='flex flex-col sm:flex-row justify-between items-end mb-10'>
                <div className='text-left'>
                    <Title text1={'INSTAGRAM'} text2={'FEED'} />
                    <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>
                        Follow us <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold'>@AwaisMart</span> for daily inspiration.
                    </p>
                </div>
                <button className='mt-6 sm:mt-0 px-8 py-3 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-full text-sm font-bold tracking-widest hover:bg-gray-800 dark:hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg'>
                    FOLLOW US
                </button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {feeds.map((item, index) => (
                    <div key={index} className='group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-md'>
                        <img 
                            src={item.image} 
                            alt={`Insta feed ${index}`} 
                            className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2'
                        />
                        
                        {/* Interactive Overlay */}
                        <div className='absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]'>
                            <div className='flex gap-6 text-white'>
                                <div className='flex items-center gap-1 font-bold'>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    {item.likes}
                                </div>
                                <div className='flex items-center gap-1 font-bold'>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>
                                    {item.comments}
                                </div>
                            </div>
                        </div>

                        {/* Corner Icon */}
                        <div className='absolute top-4 right-4 text-white opacity-80 group-hover:opacity-100 transition-opacity'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InstagramFeed
