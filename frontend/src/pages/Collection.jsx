import React, { useContext, useState, useEffect, useMemo, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useSearchParams } from 'react-router-dom';

const Collection = () => {

  const { products, search, setSearch, isDarkMode, currency } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [brand, setBrand] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [maxPrice, setMaxPrice] = useState(10000)
  const [availability, setAvailability] = useState([])
  const [selectedProfessions, setSelectedProfessions] = useState([])
  const [sortType, setSortType] = useState('relavent')
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory([categoryParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (products.length > 0) {
      const highest = Math.max(...products.map(p => p.price));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMaxPrice(highest);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriceRange([0, highest]);
    }
  }, [products]);

  const prevFiltersRef = useRef({
    category: 0, subCategory: 0, profession: 0, brand: 0, colors: 0, sizes: 0, availability: 0
  });

  useEffect(() => {
    const currentFilters = {
      category: category.length,
      subCategory: subCategory.length,
      profession: selectedProfessions.length,
      brand: brand.length,
      colors: selectedColors.length,
      sizes: selectedSizes.length,
      availability: availability.length
    };

    // Check if any filter was ADDED (length increased)
    const wasAdded = Object.keys(currentFilters).some(key => currentFilters[key] > prevFiltersRef.current[key]);
    
    // Always scroll for sort, search, or price changes as they represent a new view
    if (wasAdded || search) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }

    prevFiltersRef.current = currentFilters;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [category, subCategory, selectedProfessions, brand, selectedColors, selectedSizes, priceRange, availability, search, sortType]);

  const toggleCategory = (val) => {
    setCategory(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleSubCategory = (val) => {
    setSubCategory(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleColor = (val) => {
    setSelectedColors(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleSize = (val) => {
    setSelectedSizes(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleBrand = (val) => {
    setBrand(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleAvailability = (val) => {
    setAvailability(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const toggleProfession = (val) => {
    setSelectedProfessions(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  }

  const filterProducts = useMemo(() => {
    let productsCopy = products.slice();

    if (search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    if (selectedColors.length > 0) {
      productsCopy = productsCopy.filter(item => item.colors && item.colors.some(c => selectedColors.includes(c)));
    }

    if (selectedSizes.length > 0) {
      productsCopy = productsCopy.filter(item => item.sizes && item.sizes.some(s => selectedSizes.includes(s)));
    }

    if (brand.length > 0) {
      productsCopy = productsCopy.filter(item => brand.includes(item.brand))
    }

    if (selectedProfessions.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const itemProf = item.profession || "General";
        return selectedProfessions.some(p => p.toLowerCase() === itemProf.toLowerCase());
      });
    }

    if (availability.length > 0) {
      productsCopy = productsCopy.filter(item => {
        if (availability.includes('inStock') && item.inStock) return true;
        if (availability.includes('outOfStock') && !item.inStock) return true;
        return false;
      });
    }

    // Price Filter
    productsCopy = productsCopy.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    switch (sortType) {
      case 'low-high':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'high-low':
        return productsCopy.sort((a, b) => b.price - a.price);
      default:
        return productsCopy;
    }
  }, [products, category, subCategory, brand, selectedColors, selectedSizes, priceRange, availability, search, sortType, selectedProfessions]);

  const allColors = useMemo(() => {
    const colors = new Set();
    products.forEach(p => p.colors && p.colors.forEach(c => colors.add(c)));
    return Array.from(colors).sort();
  }, [products]);

  const allSizes = ["S", "M", "L", "XL", "XXL"];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  return (
    <div className='flex flex-col transition-colors animate-reveal'>
      
      {/* ── Premium Editorial Collection Banner ── */}
      <div className='relative w-full h-[200px] overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group'>
        <img 
          src={assets.collection_banner} 
          className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[15000ms] ease-out' 
          alt="Premium Collection Banner" 
        />
        
        {/* Cinematic Multi-layer Overlays */}
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20'></div>
        <div className='absolute inset-0 ring-1 ring-inset ring-white/10'></div>

        {/* Banner Content: Centered Editorial Layout */}
        <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-4'>
          <div className='max-w-6xl space-y-3'>
            <div className='flex items-center justify-center gap-4 animate-reveal'>
              <div className='w-12 h-[1px] bg-indigo-500/50'></div>
              <p className='text-indigo-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[1em] drop-shadow-sm'>The 2024 Anthology</p>
              <div className='w-12 h-[1px] bg-indigo-500/50'></div>
            </div>
            
            <h1 className='text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none animate-reveal animate-delay-1 drop-shadow-2xl'>
              COLLECTION <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300'>MASTERPIECE</span>
            </h1>

            <div className='flex flex-col items-center gap-2 animate-reveal animate-delay-2'>
              <p className='text-zinc-400 text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.4em] max-w-2xl opacity-80'>
                Contemporary silhouettes blended with timeless artisanal heritage.
              </p>
            </div>
          </div>
        </div>

      </div>
      


      <div className='flex flex-col lg:flex-row gap-12 border-t dark:border-gray-800 pt-10 relative'>

      <div className='lg:min-w-[340px] lg:sticky lg:top-28 h-fit'>
        <div className='bg-white dark:bg-gray-950 lg:border-[3px] border-indigo-100/80 dark:border-indigo-500/20 rounded-[2.5rem] p-6 space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] dark:shadow-none max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar relative'>
          
          {/* Subtle Color Accent */}
          <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full'></div>
          
          <div 
            onClick={()=>setShowFilter(!showFilter)} 
            className='flex items-center justify-between cursor-pointer lg:cursor-default group'
          >
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <p className='text-lg font-black dark:text-white uppercase tracking-[0.2em]'>Shop Filter</p>
          </div>
          <img className={`h-3 lg:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''} ${isDarkMode ? 'invert' : ''}`} src={assets.dropdown_icon} alt="" />
        </div>

        {/* Filter Status Badge */}
        {(category.length > 0 || subCategory.length > 0 || availability.length > 0) && (
          <div className='flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 animate-fadeIn'>
            <div className='w-2 h-2 rounded-full bg-indigo-600 animate-pulse'></div>
            <span className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest'>Filters Active</span>
          </div>
        )}
        
        <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-6 animate-reveal pb-20`}>
          
          {/* Availability Section */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Availability</p>
            <div className='flex flex-col gap-3'>
              {[
                { id: 'inStock', label: 'In Stock' },
                { id: 'outOfStock', label: 'Out of Stock' }
              ].map((opt) => (
                <label key={opt.id} className='flex items-center gap-3 cursor-pointer group'>
                  <div className='relative flex items-center justify-center'>
                    <input type="checkbox" className='peer sr-only' checked={availability.includes(opt.id)} onChange={() => toggleAvailability(opt.id)} />
                    <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                    <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dual-Thumb Price Range Filter */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-6 ml-1'>Price Spectrum</p>
            <div className='px-2 space-y-6'>
              <div className='flex flex-col gap-4'>
                <div className='space-y-1'>
                  <div className='flex justify-between text-[8px] font-black text-indigo-500 uppercase tracking-widest'>
                    <span>Min Price</span>
                    <span>{currency} {priceRange[0].toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={maxPrice} 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                    className='w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600'
                  />
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between text-[8px] font-black text-indigo-500 uppercase tracking-widest'>
                    <span>Max Price</span>
                    <span>{currency} {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={maxPrice} 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                    className='w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600'
                  />
                </div>
              </div>
              <div className='pt-2 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center'>
                <div className='flex flex-col'>
                  <span className='text-[7px] font-black text-gray-400 uppercase'>Range Selection</span>
                  <span className='text-[9px] font-black dark:text-white'>{currency}{priceRange[0]} - {currency}{priceRange[1]}</span>
                </div>
                <button onClick={() => setPriceRange([0, maxPrice])} className='text-[8px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest transition-colors'>Clear</button>
              </div>
            </div>
          </div>

          {/* Professional Color Palette Filter */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <div className='flex items-center justify-between mb-4 px-1'>
               <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]'>Refine Color</p>
               {selectedColors.length > 0 && (
                 <button onClick={() => setSelectedColors([])} className='text-[8px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors'>Reset</button>
               )}
            </div>
            <div className='grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-1'>
              {allColors.map((color) => (
                <button 
                  key={color}
                  onClick={() => toggleColor(color)}
                  className='group relative flex flex-col items-center gap-1.5 focus:outline-none'
                >
                  <div 
                    className={`w-7 h-7 rounded-full border-[3px] transition-all duration-300 shadow-sm ${selectedColors.includes(color) ? 'border-white dark:border-gray-900 ring-2 ring-indigo-500 scale-110 shadow-lg shadow-indigo-500/20' : 'border-transparent group-hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  >
                  </div>
                  {/* Tooltip on hover */}
                  <span className='absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl'>
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Sizes</p>
            <div className='flex flex-wrap gap-2'>
              {allSizes.map((sz) => (
                <div 
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer transition-all border uppercase tracking-widest ${selectedSizes.includes(sz) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400'}`}
                >
                  {sz}
                </div>
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Categories</p>
            <div className='flex flex-col gap-3'>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                  <div className='relative flex items-center justify-center'>
                    <input type="checkbox" className='peer sr-only' value={cat} checked={category.includes(cat)} onChange={() => toggleCategory(cat)} />
                    <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                    <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Classification Section */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Classification</p>
            <div className='flex flex-col gap-3'>
              {['Topwear', 'Bottomwear', 'Winterwear', 'Summerwear'].map((sub) => (
                <label key={sub} className='flex items-center gap-3 cursor-pointer group'>
                  <div className='relative flex items-center justify-center'>
                    <input type="checkbox" className='peer sr-only' value={sub} checked={subCategory.includes(sub)} onChange={() => toggleSubCategory(sub)} />
                    <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                    <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profession Filter Section */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Occasion</p>
            <div className='flex flex-col gap-3'>
              {['Casual', 'Formal', 'Wedding', 'Party', 'Streetwear'].map((prof) => (
                <label key={prof} className='flex items-center gap-3 cursor-pointer group'>
                  <div className='relative flex items-center justify-center'>
                    <input type="checkbox" className='peer sr-only' value={prof} checked={selectedProfessions.includes(prof)} onChange={() => toggleProfession(prof)} />
                    <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                    <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{prof}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Section */}
          <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
            <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-5 ml-1'>Brands</p>
            <div className='flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2'>
              {[...new Set(products.map(item => item.brand))].filter(Boolean).sort().map(b => (
                <label key={b} className='flex items-center gap-3 cursor-pointer group'>
                  <div className='relative flex items-center justify-center'>
                    <input type="checkbox" className='peer sr-only' value={b} checked={brand.includes(b)} onChange={() => toggleBrand(b)} />
                    <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                    <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{b}</span>
                </label>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Main Collection View */}
      <div className='flex-1'>
          
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
            <div className='space-y-1'>
              <Title text1={'Collection'} text2={'Archive'}/>
              <div className='flex items-center gap-2 ml-1'>
                <span className='w-2 h-2 bg-indigo-600 rounded-full animate-pulse'></span>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]'>{filterProducts.length} items curated for you</p>
              </div>
            </div>
            
            <div className='flex items-center gap-4 w-full md:w-auto'>
              <div className='relative flex-1 md:flex-none'>
                <div className='absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                </div>
                <select 
                  onChange={(e)=>setSortType(e.target.value)} 
                  className='w-full appearance-none bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest pl-12 pr-12 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer transition-all dark:text-white'
                >
                  <option value="relavent">Relavent Choice</option>
                  <option value="low-high">Valuation: Low to High</option>
                  <option value="high-low">Valuation: High to Low</option>
                </select>
                <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8'>
            {currentProducts.map((item) => (
              <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} inStock={item.inStock}/>
            ))}
          </div>

          {/* Premium Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-20 mb-10'>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? 'border-gray-100 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white shadow-sm active:scale-90 dark:text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className='flex gap-2 mx-4'>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl text-[11px] font-black transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-110' : 'bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 hover:text-indigo-600'}`}
                  >
                    {String(page).padStart(2, '0')}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-xl border transition-all ${currentPage === totalPages ? 'border-gray-100 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white shadow-sm active:scale-90 dark:text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}

          {filterProducts.length === 0 && (
            <div className='text-center py-32 bg-gray-50/50 dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800'>
              <div className='text-4xl mb-4'>🔍</div>
              <p className='text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs'>No results found</p>
            </div>
          )}
      </div>
    </div>
     </div>
  )
}
export default Collection
