import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import Skeleton from './Skeleton';

const LatestCollection = () => {

    const {products, search, setSearch} = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
        let filtered = products;
        if (search) {
             filtered = filtered.filter(item => {
                 let name = item.name.toLowerCase();
                 const term = search.toLowerCase();
                 if (name.includes('women') && !term.includes('women') && term.includes('men')) {
                     name = name.replace(/women/g, '');
                 }
                 if (name.includes('female') && !term.includes('female') && term.includes('male')) {
                     name = name.replace(/female/g, '');
                 }
                 return name.includes(term);
             });
        }
        setLatestProducts(filtered.slice(0, 30));
    },[products, search])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('latest-collection');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

  return (
    <div id='latest-collection' className={`my-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
            {search && (
                <div onClick={() => setSearch('')} className='group mx-auto mt-2 mb-4 w-max flex items-center gap-2 text-sm font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-4 py-1.5 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm active:scale-95'>
                    Search: "{search}"
                    <svg className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
            )}
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400'>
            Experience the pinnacle of modern fashion. Our latest curated arrivals blend timeless sophistication with the season's boldest trends, crafted for those who redefine elegance.
            </p>
        </div>


        {/* Rendering products or skeletons */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.length > 0
                ? latestProducts.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} inStock={item.inStock} />
                ))
                : Array(10).fill(0).map((_, index) => <Skeleton key={index} type='product' />)
            }
        </div>
    </div>
  )
} 

export default LatestCollection