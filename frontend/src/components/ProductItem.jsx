import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconHeart } from './icons/StoreIcons';
const ProductItem = ({ id, image, name, price, inStock = true }) => {

  const { currency, wishlist, toggleWishlist } = useContext(ShopContext);
  const primaryImage = Array.isArray(image) && image.length > 0 ? image[0] : '';

  return (
    <motion.div
      className='relative group hover-lift'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link className='text-gray-700 dark:text-gray-300 cursor-pointer block' to={`/product/${id}`}>
        <div className='aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative border border-gray-100 dark:border-gray-800'>
          {primaryImage ? (
            <img
              className={`w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out ${!inStock ? 'grayscale opacity-70' : ''}`}
              src={primaryImage}
              alt={name}
              loading='lazy'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-gray-400'>
              No Image
            </div>
          )}
          <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent pointer-events-none' />
          
          {!inStock && (
            <div className='absolute inset-0 flex items-center justify-center z-10'>
              <div className='bg-red-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg transform -rotate-12 border border-white/20 backdrop-blur-sm'>
                Out of Stock
              </div>
            </div>
          )}
        </div>
        <div className='p-1 flex flex-col'>
          <p className='pt-3 pb-1 text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-violet-500 transition-colors duration-300 line-clamp-1'>{name}</p>
          <div className='flex items-center justify-between'>
            <p className='text-lg font-black text-gray-900 dark:text-gray-100 tracking-tighter'>{currency}{price}</p>
            {!inStock && <span className='text-[10px] font-bold text-red-500 uppercase tracking-tighter'>Unavailable</span>}
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={wishlist.includes(id) ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => { e.preventDefault(); toggleWishlist(id); }}
        className='absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full shadow-lg hover:scale-125 active:scale-90 transition-all z-20 border border-white/20 text-gray-700 dark:text-gray-100'
      >
        <IconHeart
          filled={wishlist.includes(id)}
          className={`w-5 h-5 transition-all duration-300 ${wishlist.includes(id) ? 'text-red-500 scale-110' : 'opacity-50 group-hover:opacity-100'}`}
        />
      </button>
    </motion.div>
  )
}

export default ProductItem