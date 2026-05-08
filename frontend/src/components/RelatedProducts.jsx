import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import SunglassesCard from './SunglassesCard';

const RelatedProducts = ({ category, subCategory, type = 'product' }) => {

    const { products, sunglasses } = useContext(ShopContext);
    
    const source = type === 'sunglasses' ? sunglasses : products;
    
    const related = source.length > 0 ? source
        .filter((item) => category?.toLowerCase() === item.category?.toLowerCase())
        .filter((item) => !subCategory || subCategory === (item.subCategory || item.brand))
        .slice(0, 5) : [];

    if (related.length === 0) return null;

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'RELATED'} text2={'MASTERPIECES'} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    type === 'sunglasses' 
                        ? <SunglassesCard key={index} id={item._id} name={item.name} price={item.price} image={item.image} brand={item.brand} bestseller={item.bestseller} />
                        : <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} inStock={item.inStock} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts