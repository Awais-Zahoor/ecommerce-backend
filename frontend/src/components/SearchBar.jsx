import React, { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const { products, currency, search, setSearch, showSearch, setShowSearch, isDarkMode } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (search) {
      setShowDropdown(true);
    }
  }, [search]);

  const submitSearch = () => {
    if (search.trim() !== '') {
      setShowDropdown(false);
      setShowSearch(false);
      if (!location.pathname.includes('collection')) {
        navigate('/collection');
      }
    } else {
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  }

  const filteredResults = useMemo(() => {
    if (!search) return [];
    const term = search.toLowerCase();
    
    const matchedProducts = products.filter(item => item.name.toLowerCase().includes(term)).map(item => ({ ...item, type: 'product' }));
    
    return matchedProducts.slice(0, 6);
  }, [search, products]);

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-[72px] sm:top-[88px] left-0 w-full z-40"
        >
          <div className="glass-nav border-t border-b dark:border-gray-800 text-center py-4 sm:py-6 shadow-2xl backdrop-blur-3xl transition-colors">
            <div className="flex flex-col items-center justify-center px-4 max-w-md mx-auto relative">
              <div className="w-full flex items-center border-2 border-slate-200 dark:border-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 dark:bg-black/60 focus-within:border-black dark:focus-within:border-white focus-within:ring-4 focus-within:ring-black/5 dark:focus-within:ring-white/5 transition-all group z-[60]">
                <input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1 outline-none bg-transparent text-sm sm:text-base font-bold dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 min-w-0" 
                  type="text" 
                  placeholder="Search masterpieces..."
                />
                {search && (
                   <div onClick={() => { setSearch(''); setShowDropdown(false); }} className="cursor-pointer p-1 mr-2 opacity-50 hover:opacity-100 hover:text-red-500 transition-all">
                      <svg className="w-5 h-5 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </div>
                )}
                <img onClick={submitSearch} className={`w-4 sm:w-5 cursor-pointer opacity-50 hover:scale-110 group-focus-within:opacity-100 hover:opacity-100 transition-all ${isDarkMode ? 'invert' : ''}`} src={assets.search_icon} alt="Submit Search" title="Submit Search" />
              </div>

              {/* Live Search Results Dropdown */}
              <AnimatePresence>
                {search && showDropdown && filteredResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[50]"
                  >
                     <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
                        {filteredResults.map((item, index) => (
                           <div 
                              key={index} 
                              onClick={() => {
                                 navigate(`/product/${item._id}`);
                                 setShowSearch(false);
                                 setSearch('');
                              }}
                              className="flex items-center gap-4 p-3 border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                           >
                              <img src={item.image[0]} className="w-12 h-12 object-cover rounded-lg bg-gray-100 dark:bg-gray-800" alt={item.name} />
                              <div className="flex-1 text-left">
                                 <p className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</p>
                                 <div className="flex items-center justify-between">
                                    <p className="text-xs text-indigo-500 font-semibold">{currency}{item.price}</p>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{item.type}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div 
                        onClick={() => { navigate('/collection'); setShowDropdown(false); setShowSearch(false); }}
                        className="p-3 text-center text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-gray-800/20 cursor-pointer uppercase tracking-widest transition-colors"
                     >
                        Browse Archive
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
