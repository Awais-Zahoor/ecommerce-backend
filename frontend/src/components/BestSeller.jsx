import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const {products, search} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
        let filtered = products.filter((item)=>(item.bestseller));
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
        setBestSeller(filtered.slice(0,15))
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

        const element = document.getElementById('best-seller');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

  return (
    <div id='best-seller' className={`my-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className='text-center text-3xl py-8'>
            <Title text1={'FEATURED'} text2={'PRODUCTS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400'>
            The most coveted pieces from our boutique, handpicked for superior craftsmanship and timeless style.
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
           {
            bestSeller.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} inStock={item.inStock}/>
            ))

           }
        </div>
    </div>
  )
}

export default BestSeller