import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import EliteARView from '../components/EliteARView';
import Title from '../components/Title';

const LuxurySunglassesGrid = () => {
    const { sunglasses, currency, addToCart } = useContext(ShopContext);
    const [selectedForAR, setSelectedForAR] = useState(null);
    const [filter, setFilter] = useState('All');

    const frameTypes = ['All', 'Aviator', 'Wayfarer', 'Round', 'Cat-Eye', 'Sport'];

    const filteredItems = filter === 'All' 
        ? sunglasses 
        : sunglasses.filter(item => item.frameType === filter);

    return (
        <div className="pt-10 sm:pt-16 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-[1px] bg-indigo-600"></span>
                        <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">Maison de Optique</p>
                    </div>
                    <Title text1="Luxury" text2="Eyewear" />
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-md leading-relaxed uppercase tracking-widest opacity-80">
                        Experience the fusion of high-fashion and spatial computing.
                    </p>
                </div>

                {/* Frame Type Filter */}
                <div className="flex flex-wrap gap-2">
                    {frameTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === type ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-gray-100 dark:bg-gray-900 text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* The Luxury Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                {filteredItems.map((item, index) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item._id}
                        className="group relative"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                            <img 
                                src={item.images?.[0]?.url || item.images?.[0]} 
                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                                alt={item.name} 
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 gap-4">
                                <button 
                                    onClick={() => setSelectedForAR(item)}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-indigo-600 hover:text-white"
                                >
                                    Virtual Try-On
                                </button>
                            </div>

                            {/* Bestseller Badge */}
                            {item.isBestseller && (
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                    Bestseller
                                e</div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="mt-6 space-y-2 px-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest mb-1">{item.brand}</p>
                                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none">{item.name}</h3>
                                </div>
                                <p className="text-sm font-black dark:text-white">{currency} {item.price.toLocaleString()}</p>
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.frameType} Framework</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AR Mirror Modal */}
            <AnimatePresence>
                {selectedForAR && (
                    <EliteARView 
                        product={selectedForAR} 
                        onClose={() => setSelectedForAR(null)} 
                        onBuyNow={(prod) => {
                            addToCart(prod._id, 'Standard');
                            setSelectedForAR(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="py-40 text-center">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">No artifacts found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default LuxurySunglassesGrid;
