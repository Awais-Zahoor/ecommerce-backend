import React, { useContext, useState } from 'react'
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate, backendUrl, token, cartItems, setCartItems, products, isDarkMode, getFinalTotal, removeCoupon, getOrderDiscountSnapshot } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      let orderItems = []

      const findAnyProduct = (id) => {
        return products.find(p => p._id === id);
      };

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfoRaw = findAnyProduct(items);
            if (itemInfoRaw) {
              const itemInfo = structuredClone(itemInfoRaw);
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const discSnap = getOrderDiscountSnapshot();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getFinalTotal(),
        discountCode:   discSnap.discountCode   || '',
        discountAmount: discSnap.totalDiscount   || 0,
        discountType:   discSnap.discountType   || '',
        discountId:     discSnap.discountId     || ''
      }

      switch (method) {

        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            removeCoupon()
            toast.success("Order placed successfully");
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        }

        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          }else{
            toast.error(responseStripe.data.message)
          }

          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-16 pt-10 sm:pt-16 min-h-[80vh] border-t dark:border-gray-800 transition-colors animate-reveal'>
      
      {/* ── Delivery Information (Left) ── */}
      <div className='flex flex-col gap-8 w-full lg:max-w-[500px]'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <span className='w-1.5 h-6 bg-indigo-600 rounded-full'></span>
            <h2 className='text-xl font-black dark:text-white uppercase tracking-[0.2em]'>Shipping Destination</h2>
          </div>
          <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4'>Where should we send your masterpieces?</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='Last name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='Street Address' />

        <div className='grid grid-cols-2 gap-5'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='State' />
        </div>

        <div className='grid grid-cols-2 gap-5'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="text" placeholder='Country' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest' type="number" placeholder='Contact Number' />
      </div>

      {/* ── Payment & Totals (Right) ── */}
      <div className='flex-1 flex flex-col gap-10'>
        <div className='bg-white dark:bg-gray-900/40 p-8 sm:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none'>
          <CartTotal />
          
          <div className='mt-12 space-y-8'>
            <div className='flex items-center gap-3'>
              <span className='w-1.5 h-6 bg-indigo-600 rounded-full'></span>
              <h2 className='text-xl font-black dark:text-white uppercase tracking-[0.2em]'>Settlement Method</h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div 
                onClick={() => setMethod('stripe')} 
                className={`relative group flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${method === 'stripe' ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-950'}`}
              >
                <div className='flex items-center gap-4'>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${method === 'stripe' ? 'border-indigo-600' : 'border-gray-300 dark:border-gray-800'}`}>
                    {method === 'stripe' && <div className='w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse'/>}
                  </div>
                  <img className={`h-6 ${isDarkMode ? 'brightness-200' : ''}`} src={assets.stripe_logo} alt="Stripe" />
                </div>
                <div className={`absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-[4rem] transition-transform duration-500 ${method === 'stripe' ? 'scale-100' : 'scale-0'}`}></div>
              </div>

              <div 
                onClick={() => setMethod('cod')} 
                className={`relative group flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${method === 'cod' ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-950'}`}
              >
                <div className='flex items-center gap-4'>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${method === 'cod' ? 'border-indigo-600' : 'border-gray-300 dark:border-gray-800'}`}>
                    {method === 'cod' && <div className='w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse'/>}
                  </div>
                  <p className='text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]'>Cash on Delivery</p>
                </div>
                <div className={`absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-[4rem] transition-transform duration-500 ${method === 'cod' ? 'scale-100' : 'scale-0'}`}></div>
              </div>
            </div>

            <button 
              type='submit' 
              className='group relative w-full overflow-hidden bg-gray-950 dark:bg-white text-white dark:text-gray-950 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-indigo-500/20'
            >
              <div className='relative z-10 flex items-center justify-center gap-4'>
                <span>Finalize Purchase</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
              <div className='absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
            </button>

            <div className='flex items-center justify-center gap-6 pt-4'>
                <div className='flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity'>
                    <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <span className='text-[8px] font-black uppercase tracking-widest'>Secure</span>
                </div>
                <div className='flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity'>
                    <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className='text-[8px] font-black uppercase tracking-widest'>Protected</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder