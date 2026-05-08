import { useContext, useState, useEffect, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const OutfitBuilder = () => {
  const { products, currency, addToCart, navigate } = useContext(ShopContext);
  
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Topwear'); 
  const [topSize, setTopSize] = useState('');
  const [bottomSize, setBottomSize] = useState('');

  const topProducts = useMemo(() => products.filter(p => p.subCategory === 'Topwear'), [products]);
  const bottomProducts = useMemo(() => products.filter(p => p.subCategory === 'Bottomwear'), [products]);

  // Handle initial selection safely
  useEffect(() => {
    if (topProducts.length > 0 && !selectedTop) {
      setSelectedTop(topProducts[0]); // eslint-disable-line react-hooks/set-state-in-effect
    }
    if (bottomProducts.length > 0 && !selectedBottom) {
      setSelectedBottom(bottomProducts[0]); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [topProducts, bottomProducts, selectedTop, selectedBottom]);

  const handleAddOutfitToCart = () => {
    if (!selectedTop || !selectedBottom) {
      toast.error('Please select both a top and a bottom masterpiece.');
      return;
    }
    if (!topSize || !bottomSize) {
      toast.error('Please select sizes for both items.');
      return;
    }
    addToCart(selectedTop._id, topSize);
    addToCart(selectedBottom._id, bottomSize);
    toast.success('Complete Look added to your collection!');
  };

  const getPrice = () => {
    let total = 0;
    if (selectedTop) total += selectedTop.price;
    if (selectedBottom) total += selectedBottom.price;
    return total;
  };

  return (
    <div className='min-h-screen pb-32 bg-gray-50/30 dark:bg-gray-950/20'>
      {/* ── Editorial Studio Header ── */}
      <div className='relative w-full h-[200px] overflow-hidden mb-16 border-y border-gray-100 dark:border-gray-800 shadow-2xl bg-black'>
        <div className='absolute inset-0 opacity-20' style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #444 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-10'>
          <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className='text-indigo-500 text-[9px] font-black uppercase tracking-[0.7em] mb-2'>Virtual Styling Experience</motion.p>
          <motion.h1 initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className='text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-lg'>Masterpiece Studio</motion.h1>
          <div className='h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-4'></div>
          <p className='text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] max-w-2xl opacity-70'>Mix & Match the elite collection to build your signature aesthetic</p>
        </div>
        {/* Decorative elements */}
        <div className='absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full'></div>
        <div className='absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full'></div>
      </div>

      <div className='max-w-[1400px] mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
          
          {/* 1. The Interactive Studio Canvas */}
          <div className='lg:w-3/5 xl:w-2/3'>
            <div className='relative bg-white dark:bg-[#050505] border-2 border-indigo-50 dark:border-gray-900 rounded-[3.5rem] p-8 sm:p-16 flex flex-col items-center justify-center min-h-[850px] shadow-[0_30px_100px_rgba(0,0,0,0.05)] dark:shadow-none group overflow-hidden'>
              
              {/* Studio Stage Background with Grid */}
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/20 dark:via-indigo-500/5 to-indigo-100/30 dark:to-indigo-500/10 opacity-50'></div>
              <div className='absolute inset-0 opacity-10' style={{backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

              {/* Live Preview Elements - Positioned Centrally */}
              <div className='relative z-20 flex flex-col items-center w-full max-w-lg'>
                
                {/* Scanning Effect Overlay */}
                <motion.div 
                  animate={{ y: [0, 600, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className='absolute inset-0 w-full h-1 bg-indigo-500/40 blur-md z-30 pointer-events-none'
                ></motion.div>

                {/* Topwear Preview (Torso) */}
                <AnimatePresence mode='wait'>
                  <motion.div 
                    key={selectedTop?._id}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    className='w-[260px] sm:w-[340px] relative z-20 drop-shadow-[0_45px_45px_rgba(79,70,229,0.3)] transition-all'
                    style={{ marginTop: '-40px' }}
                  >
                    {selectedTop ? (
                      <img src={selectedTop.image[0]} className='w-full h-auto object-contain' alt="" />
                    ) : (
                      <div className='aspect-square flex items-center justify-center border-2 border-dashed border-indigo-200/50 rounded-full w-24 h-24 mx-auto'>
                         <span className='animate-pulse text-indigo-400'>•</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Bottomwear Preview (Legs) */}
                <AnimatePresence mode='wait'>
                  <motion.div 
                    key={selectedBottom?._id}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    className='w-[200px] sm:w-[280px] -mt-8 sm:-mt-12 relative z-10 drop-shadow-[0_35px_35px_rgba(79,70,229,0.2)] transition-all'
                  >
                    {selectedBottom ? (
                      <img src={selectedBottom.image[0]} className='w-full h-auto object-contain' alt="" />
                    ) : (
                      <div className='aspect-square flex items-center justify-center border-2 border-dashed border-indigo-200/50 rounded-full w-24 h-24 mx-auto mt-20'>
                         <span className='animate-pulse text-indigo-400'>•</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Studio Grid Overlay */}
              <div className='absolute bottom-12 left-12 flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]'></div>
                  <p className='text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]'>System: Virtual Try-On</p>
                </div>
                <p className='text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight'>Calibrating Masterpiece Ensemble...</p>
              </div>

              {/* Right Sidebar Stats in Canvas */}
              <div className='absolute top-12 right-12 flex flex-col gap-4 text-right'>
                <div className='bg-indigo-600/10 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 px-6 py-4 rounded-3xl backdrop-blur-md'>
                  <p className='text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1'>Ensemble Value</p>
                  <p className='text-2xl font-black text-gray-900 dark:text-white'>{currency}{getPrice().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Selection & Configuration Controls */}
          <div className='lg:w-2/5 xl:w-1/3 flex flex-col gap-6'>
            
            <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-8 shadow-xl shadow-gray-100 dark:shadow-none flex flex-col h-full'>
              
              {/* Modern Category Selector */}
              <div className='flex p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] mb-8'>
                {['Topwear', 'Bottomwear'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-3.5 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {cat === 'Topwear' ? 'The Tops' : 'The Bottoms'}
                  </button>
                ))}
              </div>

              {/* Scrollable Gallery */}
              <div className='flex-1 no-scrollbar overflow-y-auto max-h-[480px] mb-8 pr-1'>
                <div className='grid grid-cols-2 gap-4'>
                  {(activeCategory === 'Topwear' ? topProducts : bottomProducts).map((product) => {
                    const isSelected = activeCategory === 'Topwear' ? selectedTop?._id === product._id : selectedBottom?._id === product._id;
                    return (
                      <div 
                        key={product._id} 
                        onClick={() => activeCategory === 'Topwear' ? setSelectedTop(product) : setSelectedBottom(product)}
                        className={`group relative p-3 rounded-3xl border-[3px] transition-all duration-500 cursor-pointer ${isSelected ? 'border-indigo-600 bg-indigo-50/20 shadow-lg' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        <div className='aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 mb-3'>
                          <img src={product.image[0]} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' alt="" />
                        </div>
                        <p className='text-[10px] font-black uppercase tracking-tight truncate dark:text-white leading-tight mb-1'>{product.name}</p>
                        <p className='text-[11px] font-black text-indigo-600'>{currency}{product.price.toLocaleString()}</p>
                        
                        {isSelected && (
                          <motion.div initial={{scale:0}} animate={{scale:1}} className='absolute top-5 right-5 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-900'>
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Configuration Panel */}
              <div className='pt-8 border-t border-gray-100 dark:border-gray-800 space-y-8 mt-auto'>
                
                {/* Responsive Size Selectors */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between px-1'>
                      <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Top Size</p>
                      <span className='text-[8px] font-bold text-indigo-500 uppercase'>{topSize || 'Required'}</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {selectedTop?.sizes?.map((sz) => (
                        <button 
                          key={sz} 
                          onClick={() => setTopSize(sz)} 
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all active:scale-90 ${topSize === sz ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between px-1'>
                      <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Bottom Size</p>
                      <span className='text-[8px] font-bold text-indigo-500 uppercase'>{bottomSize || 'Required'}</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {selectedBottom?.sizes?.map((sz) => (
                        <button 
                          key={sz} 
                          onClick={() => setBottomSize(sz)} 
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all active:scale-90 ${bottomSize === sz ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unified CTA Button */}
                <button 
                  onClick={handleAddOutfitToCart}
                  className='w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group'
                >
                  <span className='w-8 h-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:rotate-12 transition-transform'>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </span>
                  Add Archive Ensemble
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitBuilder;
