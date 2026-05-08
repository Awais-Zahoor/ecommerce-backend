import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion, useAnimation, useInView } from 'framer-motion';

const CategoryShowcase = () => {
    const { products } = useContext(ShopContext);
    const tabs = ['Men', 'Women', 'Kids'];
    const containerRef = useRef(null);

    const DepartmentSection = ({ title, direction = 'left', bounce = false }) => {
        const filtered = products.filter(item => item.category === title).slice(0, 8);
        const marqueeProducts = [...filtered, ...filtered];
        const sectionRef = useRef(null);
        const isInView = useInView(sectionRef);

        if (filtered.length === 0) return null;

        return (
            <div ref={sectionRef} className='mb-24 last:mb-0'>
                <div className='flex items-center gap-4 mb-8 px-4 sm:px-[5vw]'>
                    <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent' />
                    <h2 className='text-xl sm:text-2xl font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white'>{title}</h2>
                    <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent' />
                </div>

                <div className='relative overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-4'>
                    <motion.div 
                        className='flex gap-6 px-10'
                        animate={isInView ? {
                            x: direction === 'left' ? [0, -1200] : [-1200, 0],
                            y: bounce ? [0, -12, 0] : [0, 0],
                        } : {}}
                        transition={{
                            x: {
                                duration: bounce ? 50 : 40,
                                repeat: Infinity,
                                ease: "linear"
                            },
                            y: {
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        {marqueeProducts.map((item, index) => (
                            <div key={`${title}-${index}`} className='min-w-[200px] sm:min-w-[240px] transition-transform duration-500 hover:scale-105'>
                                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} inStock={item.inStock} />
                            </div>
                        ))}
                    </motion.div>
                    
                    {/* Edge Fades */}
                    <div className='absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none' />
                    <div className='absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none' />
                </div>
            </div>
        );
    };

    return (
        <div className='my-32' id='category-showcase' ref={containerRef}>
            <div className='text-center mb-20 px-4 sm:px-[5vw]'>
                <Title text1={'TRENDING'} text2={'DEPARTMENTS'} />
                <p className='w-full sm:w-2/3 m-auto text-[10px] sm:text-xs text-indigo-500 font-black uppercase tracking-[0.4em] mt-4'>
                    Explore Our Curated Luxury Collections
                </p>
            </div>

            <DepartmentSection title="Men" direction="left" />
            <DepartmentSection title="Women" direction="right" />
            <DepartmentSection title="Kids" direction="left" bounce={true} />
        </div>
    );
};

export default CategoryShowcase;
