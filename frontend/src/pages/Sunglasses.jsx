import React, { useContext, useState, useEffect, useMemo, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import SunglassesCard from '../components/SunglassesCard';
import { useSearchParams } from 'react-router-dom';

const Sunglasses = () => {
    const { sunglasses, search, isDarkMode, currency } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    
    const [category, setCategory] = useState([])
    const [brand, setBrand] = useState([])
    const [priceRange, setPriceRange] = useState([0, 20000])
    const [maxPrice, setMaxPrice] = useState(20000)
    const [availability, setAvailability] = useState([])
    const [sortType, setSortType] = useState('relavent')
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setCategory([categoryParam]);
        }
    }, [searchParams]);

    useEffect(() => {
        if (sunglasses.length > 0) {
            const highest = Math.max(...sunglasses.map(p => p.price));
            setMaxPrice(highest);
            setPriceRange([0, highest]);
        }
    }, [sunglasses]);

    const prevFiltersRef = useRef({
        category: 0, brand: 0, availability: 0
    });

    useEffect(() => {
        const currentFilters = {
            category: category.length,
            brand: brand.length,
            availability: availability.length
        };

        const wasAdded = Object.keys(currentFilters).some(key => currentFilters[key] > prevFiltersRef.current[key]);
        
        if (wasAdded || search) {
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }

        prevFiltersRef.current = currentFilters;
        setCurrentPage(1);
    }, [category, brand, priceRange, availability, search, sortType]);

    const toggleCategory = (val) => {
        setCategory(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    }

    const toggleBrand = (val) => {
        setBrand(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    }

    const toggleAvailability = (val) => {
        setAvailability(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    }

    const filterProducts = useMemo(() => {
        let productsCopy = sunglasses.slice();

        if (search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category.toLowerCase()));
        }

        if (brand.length > 0) {
            productsCopy = productsCopy.filter(item => brand.includes(item.brand))
        }

        if (availability.length > 0) {
            productsCopy = productsCopy.filter(item => {
                if (availability.includes('inStock') && item.stock > 0) return true;
                if (availability.includes('outOfStock') && item.stock <= 0) return true;
                return false;
            });
        }

        productsCopy = productsCopy.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        switch (sortType) {
            case 'low-high':
                return productsCopy.sort((a, b) => a.price - b.price);
            case 'high-low':
                return productsCopy.sort((a, b) => b.price - a.price);
            case 'newest':
                return productsCopy.sort((a, b) => b.createdAt - a.createdAt);
            default:
                return productsCopy;
        }
    }, [sunglasses, category, brand, priceRange, availability, search, sortType]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

    return (
        <div className='flex flex-col transition-colors animate-reveal'>
            
            {/* Sunglasses Editorial Banner */}
            <div className='relative w-full h-[250px] overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group rounded-[3rem]'>
                <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=2000" 
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10000ms] ease-out' 
                    alt="Luxury Eyewear" 
                />
                
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90'></div>
                
                <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-4'>
                    <div className='max-w-6xl space-y-3'>
                        <div className='flex items-center justify-center gap-4 animate-reveal'>
                            <div className='w-12 h-[1px] bg-indigo-500/50'></div>
                            <p className='text-indigo-400 text-[10px] font-black uppercase tracking-[1em]'>High Definition</p>
                            <div className='w-12 h-[1px] bg-indigo-500/50'></div>
                        </div>
                        
                        <h1 className='text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none animate-reveal'>
                            LUXURY <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300'>EYEWEAR</span>
                        </h1>

                        <p className='text-zinc-400 text-[10px] font-medium uppercase tracking-[0.4em] max-w-2xl opacity-80 mx-auto'>
                            Handcrafted frames with superior optical clarity and timeless design.
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-12 border-t dark:border-gray-800 pt-10 relative'>

                <div className='lg:min-w-[340px] lg:sticky lg:top-28 h-fit'>
                    <div className='bg-white dark:bg-gray-950 lg:border-[3px] border-indigo-100/80 dark:border-indigo-500/20 rounded-[2.5rem] p-6 space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] dark:shadow-none max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar'>
                        
                        <div onClick={()=>setShowFilter(!showFilter)} className='flex items-center justify-between cursor-pointer lg:cursor-default'>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-lg'>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <p className='text-lg font-black dark:text-white uppercase tracking-[0.2em]'>Filters</p>
                            </div>
                            <img className={`h-3 lg:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''} ${isDarkMode ? 'invert' : ''}`} src={assets.dropdown_icon} alt="" />
                        </div>

                        <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-6 pb-20`}>
                            
                            {/* Availability */}
                            <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-5'>Availability</p>
                                <div className='flex flex-col gap-3'>
                                    {[{ id: 'inStock', label: 'In Stock' }, { id: 'outOfStock', label: 'Out of Stock' }].map((opt) => (
                                        <label key={opt.id} className='flex items-center gap-3 cursor-pointer group'>
                                            <div className='relative flex items-center justify-center'>
                                                <input type="checkbox" className='peer sr-only' checked={availability.includes(opt.id)} onChange={() => toggleAvailability(opt.id)} />
                                                <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                                                <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6'>Price Range</p>
                                <div className='space-y-6 px-1'>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <div className='flex justify-between text-[8px] font-black text-indigo-500 uppercase tracking-widest'>
                                                <span>Min</span>
                                                <span>{currency}{priceRange[0].toLocaleString()}</span>
                                            </div>
                                            <input type="range" min="0" max={maxPrice} value={priceRange[0]} onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])} className='w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600' />
                                        </div>
                                        <div className='space-y-1'>
                                            <div className='flex justify-between text-[8px] font-black text-indigo-500 uppercase tracking-widest'>
                                                <span>Max</span>
                                                <span>{currency}{priceRange[1].toLocaleString()}</span>
                                            </div>
                                            <input type="range" min="0" max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])} className='w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600' />
                                        </div>
                                    </div>
                                    <button onClick={() => setPriceRange([0, maxPrice])} className='w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-indigo-600 hover:text-white transition-all'>Reset Price</button>
                                </div>
                            </div>

                            {/* Category Section */}
                            <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-5'>Categories</p>
                                <div className='flex flex-col gap-3'>
                                    {[
                                        { id: 'men', label: 'Men' },
                                        { id: 'women', label: 'Women' },
                                        { id: 'kids', label: 'Kids' }
                                    ].map((cat) => (
                                        <label key={cat.id} className='flex items-center gap-3 cursor-pointer group'>
                                            <div className='relative flex items-center justify-center'>
                                                <input type="checkbox" className='peer sr-only' value={cat.id} checked={category.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                                                <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                                                <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-5'>Brands</p>
                                <div className='flex flex-col gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2'>
                                    {[...new Set(sunglasses.map(item => item.brand))].filter(Boolean).sort().map(b => (
                                        <label key={b} className='flex items-center gap-3 cursor-pointer group'>
                                            <div className='relative flex items-center justify-center'>
                                                <input type="checkbox" className='peer sr-only' value={b} checked={brand.includes(b)} onChange={() => toggleBrand(b)} />
                                                <div className='w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all'></div>
                                                <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className='text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest'>{b}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex-1'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
                        <div className='space-y-1'>
                            <Title text1={'Signature'} text2={'Eyewear'}/>
                            <div className='flex items-center gap-2 ml-1'>
                                <span className='w-2 h-2 bg-indigo-600 rounded-full animate-pulse'></span>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]'>{filterProducts.length} masterpieces found</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-4 w-full md:w-auto'>
                            <select 
                                onChange={(e)=>setSortType(e.target.value)} 
                                className='w-full md:w-auto bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl outline-none cursor-pointer'
                            >
                                <option value="relavent">Relevant Choice</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {currentProducts.map((item) => (
                            <SunglassesCard key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} brand={item.brand} bestseller={item.bestseller} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className='flex justify-center items-center gap-4 mt-20 mb-10'>
                            {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[11px] font-black transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-xl' : 'bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 hover:text-indigo-600'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}

                    {filterProducts.length === 0 && (
                        <div className='text-center py-32 bg-gray-50/50 dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800'>
                            <div className='text-4xl mb-4'>🕶️</div>
                            <p className='text-gray-500 font-bold uppercase tracking-widest text-xs'>No eyewear matches your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sunglasses
