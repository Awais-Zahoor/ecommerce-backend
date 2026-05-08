import React, { useContext, useEffect, useState, useRef, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import ProfessionalTryOn from '../components/ProfessionalTryOn'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import StarRating from '../components/StarRating'
import ReviewSection from '../components/ReviewSection'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Stage, Float } from '@react-three/drei'

// 3D Product Viewer for sunglasses detail page
const ProductViewer3D = ({ modelUrl }) => {
    const { backendUrl } = useContext(ShopContext);
    const fullUrl = modelUrl ? `${backendUrl}/models/${modelUrl}` : null;
    const { scene } = useGLTF(fullUrl || 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/glasses/model.gltf');
    
    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <primitive object={scene} scale={2} />
        </Float>
    );
};

const SunglassesProduct = () => {
  const { productId } = useParams();
  const { currency, addToCart, backendUrl, navigate, isDarkMode = false } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTryOn, setShowTryOn] = useState(false);
  const [allSunglasses, setAllSunglasses] = useState([]);
  const reviewSectionRef = useRef(null);

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollToSection();
  }

  const fetchProductData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/sunglasses/single', { sunglassesId: productId })
      if (response.data.success) {
        setProductData(response.data.sunglasses);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load 3D engine details");
    } finally {
      setLoading(false);
    }
  }

  const fetchAllSunglasses = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/sunglasses/list');
      if (response.data.success) {
        setAllSunglasses(response.data.sunglasses);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProductData();
    fetchAllSunglasses();
  }, [productId])

  if (loading) {
    return <div className='flex justify-center items-center h-[60vh]'><div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div></div>
  }

  if (!productData) {
    return <div className='h-[60vh] flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest'>Engine Not Found</div>
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 pb-20'>
      
      {/* Editorial Header */}
      <div className='mb-12'>
         <p className='text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em] mb-2'>3D Optical Studio</p>
         <h1 className='text-4xl sm:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter'>{productData.name}</h1>
      </div>

      <div className='flex gap-12 sm:gap-16 flex-col sm:flex-row'>
        
        {/* 3D Model Interactive Viewer */}
        <div className='flex-1'>
          <div className='aspect-[4/5] sm:aspect-square bg-gray-50 dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative shadow-inner'>
            <Suspense fallback={
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Initializing Engine...</p>
                    </div>
                </div>
            }>
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Stage environment="city" intensity={0.6}>
                        <ProductViewer3D modelUrl={productData.model3D} />
                    </Stage>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </Suspense>

            <div className='absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full border border-gray-100 dark:border-gray-800'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                <p className='text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest'>Interactive 3D Preview</p>
            </div>

            <button 
              onClick={() => setShowTryOn(true)}
              className='absolute bottom-8 right-8 bg-black dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group'
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Virtual Try-On
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <div className='space-y-8'>
            <div className='space-y-2'>
              <p className='text-indigo-500 font-black text-sm uppercase tracking-widest'>{productData.brand}</p>
              <div className='flex items-center gap-4'>
                 <p className='text-3xl font-black text-gray-900 dark:text-white'>{currency}{productData.price.toLocaleString()}</p>
                 {productData.bestseller && (
                    <span className='px-4 py-1.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full'>Core Collection</span>
                 )}
              </div>
            </div>

            <div onClick={scrollToReviews} className='flex items-center gap-4 mt-2 cursor-pointer group/rating hover:translate-x-1 transition-transform'>
              <StarRating rating={productData.ratings || 0} size="w-4 h-4" />
              <p className='pl-2 text-gray-400 font-bold text-xs group-hover/rating:text-indigo-500 transition-colors'>({productData.numReviews || 0} Enthusiasts)</p>
            </div>

            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-lg'>
              {productData.description}
            </p>

            <div className='space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800'>
              <div className='flex items-center gap-4'>
                <span className={`w-3 h-3 rounded-full ${productData.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                  {productData.stock > 0 ? `In Stock (${productData.stock} Units)` : 'Sold Out'}
                </p>
              </div>

              <button 
                onClick={() => addToCart(productData._id, 'default')} 
                disabled={productData.stock === 0}
                className={`w-full max-w-md h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl ${productData.stock > 0 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {productData.stock > 0 ? 'Secure Product' : 'Engine Unavailable'}
              </button>
            </div>

            <div className='pt-10 flex flex-col gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>
               <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600'>✓</div>
                  <p>100% Original 3D Architecture</p>
               </div>
               <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600'>✓</div>
                  <p>Virtual Studio Integration Active</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection 
        ref={reviewSectionRef}
        productId={productId} 
        type="sunglasses" 
        initialReviews={productData.reviews} 
        initialRating={productData.ratings} 
        initialNumReviews={productData.numReviews} 
      />

      {/* Related Sunglasses */}
      <RelatedProducts category={productData.category} subCategory={productData.brand} type='sunglasses' />

      {/* AI Try On Modal */}
      <AnimatePresence>
        {showTryOn && (
          <ProfessionalTryOn 
            selectedItem={productData} 
            onClose={() => setShowTryOn(false)} 
            sunglassesList={allSunglasses}
            isDarkMode={isDarkMode}
            onSwitch={(item) => {
              navigate(`/sunglasses/${item._id}`);
              setShowTryOn(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SunglassesProduct
