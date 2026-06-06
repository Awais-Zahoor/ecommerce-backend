import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { IconHeartEmptyState } from '../components/icons/StoreIcons';

const Wishlist = () => {

  const { products, wishlist } = useContext(ShopContext);
  const wishlistProducts = products.filter(item => wishlist.includes(item._id));

  return (
    <div className='pt-14 transition-colors duration-500'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlistProducts.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {wishlistProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))}
        </div>
      ) : (
        <div className='text-center py-20 flex flex-col items-center gap-4'>
          <IconHeartEmptyState className="w-24 h-24 text-gray-300 dark:text-gray-600" />
          <p className='text-gray-500 dark:text-gray-400 text-lg'>Your wishlist is empty.</p>
          <button 
             onClick={() => window.location.href = '/collection'}
             className='mt-4 bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm active:bg-gray-700 dark:active:bg-gray-200 transition-all rounded-md'
          >
            CONTINUE SHOPPING
          </button>
        </div>
      )}
    </div>
  )
}

export default Wishlist
