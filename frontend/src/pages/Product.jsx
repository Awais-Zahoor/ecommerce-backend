import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { IconSparkles, IconTruck } from '../components/icons/StoreIcons';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, isDarkMode } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const reviewSectionRef = useRef(null);

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollToSection();
  }

  const fetchProductData = async () => {
    const selected = products.find((item) => item._id === productId);
    if (selected) {
      setProductData(selected);
      setImage(selected.image?.[0] || '');
    }
  }

  useEffect(() => {
    fetchProductData();

  }, [productId, products])


  return productData ? (
    <div className='border-t dark:border-gray-800 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------------- Product Data ------------*/}
      <div className='flex gap-10 lg:gap-16 flex-col lg:flex-row'>

        {/* -------------Product Images ----------------*/}
        <div className='flex-1 flex flex-col-reverse gap-4 lg:flex-row font-medium'>
          <div className='flex lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar justify-start lg:justify-normal lg:w-[18.7%] w-full gap-2 sm:gap-3 pb-1 lg:pb-0'>
            {
              productData.image.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setImage(item)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border-2 ${image === item ? 'border-indigo-500 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'} w-14 sm:w-16 lg:w-full flex-shrink-0 aspect-square bg-gray-50 dark:bg-gray-900 `}
                >
                  <img src={item} className='w-full h-full object-cover object-center' alt="" loading='lazy' />
                </div>
              ))
            }
          </div>
          <div className='w-full lg:w-[80%] group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border dark:border-gray-800 shadow-2xl aspect-[3/4] sm:aspect-[4/5]'>
            {image ? (
              <img className='w-full h-full object-cover object-center transition-all duration-700 hover:scale-105' src={image} alt="" />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400'>
                Image Unavailable
              </div>
            )}
          </div>
        </div>

        {/*---------------- Product info---------- */}
        <div className='flex-1 lg:max-w-xl'>
          <div className='space-y-4'>
            <div>
              <p className='text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em] mb-2'>{productData.brand || 'Boutique Collection'}</p>
              <h1 className='text-3xl lg:text-4xl font-black dark:text-white uppercase tracking-tight leading-tight'>{productData.name}</h1>
            </div>

            <div onClick={scrollToReviews} className='flex items-center gap-4 py-1 cursor-pointer group/rating hover:translate-x-1 transition-transform'>
               <StarRating rating={productData.ratings || 0} size="w-4 h-4" />
               <p className='text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-l pl-4 dark:border-gray-800 group-hover/rating:text-indigo-500 transition-colors'>{productData.numReviews || 0} Verified Reviews</p>
            </div>

            <div className='flex items-baseline gap-4'>
              <p className='text-4xl font-black text-slate-900 dark:text-white tracking-tighter'>{currency}{productData.price.toLocaleString()}</p>
              <p className='text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full'>Tax Included</p>
            </div>

            {/* Dynamic Stock Status */}
            <div className='flex items-center gap-2 py-1'>
                {(!productData.inStock || productData.stockQuantity === 0) ? (
                    <div className='flex items-center gap-2 text-rose-500'>
                        <span className='w-2 h-2 rounded-full bg-rose-500 animate-pulse'></span>
                        <p className='text-[10px] font-black uppercase tracking-[0.2em]'>Currently Out of Stock</p>
                    </div>
                ) : productData.stockQuantity <= 5 ? (
                    <div className='flex items-center gap-2 text-amber-500'>
                        <span className='w-2 h-2 rounded-full bg-amber-500 animate-bounce'></span>
                        <p className='text-[10px] font-black uppercase tracking-[0.2em]'>Low Stock: Only {productData.stockQuantity} items left</p>
                    </div>
                ) : (
                    <div className='flex items-center gap-2 text-emerald-500'>
                        <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                        <p className='text-[10px] font-black uppercase tracking-[0.2em]'>In Stock & Ready to Ship</p>
                    </div>
                )}
            </div>

            <p className='text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg'>
              {productData.description}
            </p>
          </div>
          
          <div className='flex flex-col gap-5 my-10'>
            <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200'>Select Your Size</p>
            <div className='flex flex-wrap gap-3 font-black'>
              {productData.sizes.map((item, index) => (
                <button 
                  key={index}
                  onClick={() => setSize(item)} 
                  className={`
                    w-14 h-14 flex items-center justify-center rounded-2xl text-xs uppercase transition-all duration-300 shadow-sm
                    ${item === size 
                      ? 'bg-black dark:bg-white text-white dark:text-black scale-110 shadow-indigo-500/20 shadow-xl' 
                      : 'bg-white dark:bg-gray-900 text-slate-400 border dark:border-gray-800 hover:border-indigo-500 hover:text-indigo-500'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {productData.inStock ? (
              <button 
                onClick={() => addToCart(productData._id, size)} 
                className='group flex items-center justify-center gap-4 bg-black dark:bg-white text-white dark:text-black w-full lg:w-auto px-12 py-5 text-xs font-black uppercase tracking-[0.3em] rounded-[1.5rem] active:scale-[0.98] hover:scale-[1.02] transition-all shadow-2xl shadow-black/10 dark:shadow-white/10'
              >
                <img src={assets.cart_icon} className={`w-5 ${isDarkMode ? '' : 'invert'} group-hover:rotate-12 transition-transform`} alt="" />
                ADD TO SHOPPING BAG
              </button>
            ) : (
              <button disabled className='w-full lg:w-auto bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 px-12 py-5 text-xs font-black uppercase tracking-[0.3em] rounded-[1.5rem] cursor-not-allowed'>
                Currently Out of Stock
              </button>
            )}

            <div className='grid grid-cols-2 gap-4 mt-10'>
              <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border dark:border-gray-900'>
                 <div className='w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm text-indigo-600 dark:text-cyan-400'>
                    <IconSparkles className="w-5 h-5" />
                 </div>
                 <div>
                    <p className='text-[10px] font-black uppercase tracking-widest dark:text-white'>Authentic</p>
                    <p className='text-[10px] text-slate-400 font-bold uppercase'>100% Original</p>
                 </div>
              </div>
              <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border dark:border-gray-900'>
                 <div className='w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm text-indigo-600 dark:text-cyan-400'>
                    <IconTruck className="w-5 h-5" />
                 </div>
                 <div>
                    <p className='text-[10px] font-black uppercase tracking-widest dark:text-white'>Fast Delivery</p>
                    <p className='text-[10px] text-slate-400 font-bold uppercase'>Ship in 24h</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------Description & Review Section------ */}
      <div className='mt-24'>
        <div className='flex gap-1 mb-[-1px] relative z-10 overflow-x-auto no-scrollbar'>
          <button className='border-t border-l border-r dark:border-gray-800 px-8 py-4 text-xs font-black uppercase tracking-widest bg-white dark:bg-gray-900 dark:text-white rounded-t-2xl shadow-sm'>
             Product Details
          </button>
        </div>
        <div className='flex flex-col gap-8 border dark:border-gray-800 px-8 py-10 text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900 rounded-[2rem] rounded-tl-none shadow-sm transition-colors'>
          <div className='space-y-4'>
             <h4 className='font-black dark:text-white uppercase tracking-widest text-xs'>Unmatched Craftsmanship</h4>
             <p>Experience luxury redefine. Each piece in our collection is curated with meticulous attention to detail, ensuring the perfect balance of contemporary style and timeless elegance. Crafted from premium materials source globally, this product embodies the pinnacle of boutique quality.</p>
          </div>
          <div className='space-y-4'>
             <h4 className='font-black dark:text-white uppercase tracking-widest text-xs'>Technical Excellence</h4>
             <p>From the precise stitching to the ergonomic design, every element has been optimized for both performance and aesthetic appeal. Whether you're heading to a gala or a high-stakes meeting, this addition to your wardrobe guarantees a presence that is felt before it is seen.</p>
          </div>
        </div>
      </div>

      <ReviewSection 
        ref={reviewSectionRef}
        productId={productId} 
        type="product" 
        initialReviews={productData.reviews} 
        initialRating={productData.ratings} 
        initialNumReviews={productData.numReviews} 
      />

      {/* ------------display related products-------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product