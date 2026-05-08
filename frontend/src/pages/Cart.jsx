import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { motion, AnimatePresence } from 'framer-motion';
import { IconGift, IconTag, IconCheckCircle } from '../components/icons/StoreIcons';

const Cart = () => {

  const { products, sunglasses, currency, cartItems, updateQuantity, navigate, autoDiscounts, getCartAmount, isDiscountScheduleLive } = useContext(ShopContext);

  const cartAmt = getCartAmount();

  const findAnyProduct = (id) => {
    return products.find(p => p._id === id) || sunglasses.find(s => s._id === id);
  };

  // Determine which auto discounts are relevant to show as banners
  const activeBanners = autoDiscounts.filter(ad => {
    if (!ad.isActive) return false;
    if (!isDiscountScheduleLive(ad)) return false;
    if (ad.type === 'free_shipping') return true; // progress toward this rule
    if (ad.type === 'auto_category') {
      return Object.keys(cartItems).some(itemId => {
        const p = findAnyProduct(itemId);
        return p && p.category?.toLowerCase() === ad.categoryTarget?.toLowerCase();
      });
    }
    return false;
  });

  const cartData = React.useMemo(() => {
    if (products.length === 0 && sunglasses.length === 0) return [];
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    return tempData;
  }, [cartItems, products, sunglasses]);

  return (
    <div className='border-t dark:border-gray-800 pt-10 sm:pt-14 transition-all duration-500'>

      <div className='text-3xl mb-6'>
        <Title text1={'SHOPPING'} text2={'CART'} />
      </div>

      {/* ── Auto Discount Banners ── */}
      {activeBanners.length > 0 && (
        <div className='flex flex-col gap-2 mb-8'>
          {activeBanners.map(ad => {
            const isFS = ad.type === 'free_shipping';
            const threshold = ad.minCartValue || 0;
            const remaining = Math.max(threshold - cartAmt, 0);
            const qualified = cartAmt >= threshold;
            return (
              <motion.div
                key={ad._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold ${
                  isFS
                    ? qualified
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300'
                }`}
              >
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 dark:bg-black/20">
                  {isFS ? (
                    qualified ? (
                      <IconCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <IconGift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    )
                  ) : (
                    <IconTag className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  )}
                </span>
                <span>
                  {isFS
                    ? qualified
                      ? `You've unlocked free shipping on this order.`
                      : `Add ${currency}${remaining.toLocaleString()} more for free shipping (${ad.name}).`
                    : `${ad.value}% off auto-applied on "${ad.categoryTarget}" items.`
                  }
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-12'>
        
        {/* Cart Items List */}
        <div className='flex-1'>
          <AnimatePresence mode='popLayout'>
            {cartData.length > 0 ? (
              cartData.map((item, index) => {
                const productData = findAnyProduct(item._id);
                if (!productData) return null;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={`${item._id}-${item.size}`} 
                    className='group relative bg-white dark:bg-gray-900/40 p-4 sm:p-5 mb-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all shadow-sm hover:shadow-md'
                  >
                    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
                      {/* Product Image */}
                      <div className='relative w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700'>
                        <img className='w-full h-full object-cover transition-transform group-hover:scale-110' src={productData.image[0]} alt={productData.name} />
                      </div>

                      {/* Product Info */}
                      <div className='flex-1 w-full flex flex-col justify-between'>
                        <div className='text-center sm:text-left'>
                          <p className='text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1'>{productData.brand || 'Premium Collection'}</p>
                          <h3 className='text-lg sm:text-xl font-black dark:text-white uppercase tracking-tight leading-tight'>{productData.name}</h3>
                          <div className='flex items-center justify-center sm:justify-start gap-4 mt-2'>
                            <p className='text-xl font-black text-slate-900 dark:text-slate-100'>{currency}{productData.price.toLocaleString()}</p>
                            <span className='px-4 py-1 text-[10px] font-black bg-slate-100 dark:bg-slate-800 rounded-full border dark:border-gray-700 uppercase tracking-widest'>Size: {item.size}</span>
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className='flex items-center justify-between mt-6 sm:mt-4 bg-gray-50/50 dark:bg-white/[0.02] p-2 rounded-2xl border dark:border-gray-800 sm:border-transparent'>
                          <div className='flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border dark:border-gray-700'>
                            <button 
                              onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                              className='w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all active:scale-90 font-black dark:text-white'
                            >
                              -
                            </button>
                            <span className='w-10 text-center font-black dark:text-white'>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className='w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all active:scale-90 font-black dark:text-white'
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className='p-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all active:scale-90 group/btn shadow-sm'
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className='text-center py-20 bg-gray-50 dark:bg-gray-950/40 rounded-3xl border-2 border-dashed dark:border-gray-800'
              >
                <div className='w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className='text-xl font-bold dark:text-white'>Your cart is empty</h3>
                <p className='text-gray-500 mt-2'>Looks like you haven't added anything to your cart yet.</p>
                <button onClick={() => navigate('/collection')} className='mt-8 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all'>Start Shopping</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Hub */}
        <div className='w-full lg:w-[400px]'>
          <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl sticky top-28'>
            <h3 className='text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider mb-6 pb-4 border-b dark:border-gray-800'>Order Summary</h3>
            <CartTotal />
            <button 
              onClick={() => cartData.length > 0 && navigate('/place-order')} 
              disabled={cartData.length === 0}
              className='w-full bg-black dark:bg-white text-white dark:text-black px-8 py-5 mt-8 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:shadow-cyan-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group'
            >
              <div className='flex items-center justify-center gap-3'>
                <span>Proceed to Checkout</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
            <div className='mt-6 flex flex-col gap-3'>
              <div className='flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-tighter'>
                <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded'>✓</span>
                Secured SSL checkout
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Cart
