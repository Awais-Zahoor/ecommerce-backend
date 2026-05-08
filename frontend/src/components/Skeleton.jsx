import React from 'react'

const Skeleton = ({ type }) => {
    
    // Product Item Skeleton
    if (type === 'product') {
        return (
            <div className='animate-pulse'>
                <div className='aspect-[4/5] w-full rounded-xl bg-slate-100 dark:bg-gray-800 mb-4'></div>
                <div className='h-3 w-3/4 bg-slate-100 dark:bg-gray-800 rounded-full mb-2'></div>
                <div className='h-4 w-1/4 bg-slate-100 dark:bg-gray-800 rounded-full'></div>
            </div>
        )
    }

    // Default Block Skeleton
    return (
        <div className='animate-pulse bg-slate-100 dark:bg-gray-800 rounded-xl w-full h-full'></div>
    )
}

export default Skeleton
