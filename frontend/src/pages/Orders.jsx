import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IconReceipt } from '../components/icons/StoreIcons';

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);
  const [orderData, setorderData] = useState([])

  const loadOrderData = React.useCallback(async () => {
    try {
      if (!token) return null;
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        setorderData(response.data.orders.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, [backendUrl, token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Order Placed': return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' };
      case 'Packing': return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' };
      case 'Shipped': return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' };
      case 'Out for delivery': return { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' };
      case 'Delivered': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' };
      default: return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' };
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [loadOrderData])

  return (
    <div className='border-t dark:border-gray-800 pt-16 transition-all duration-500'>

      <div className='text-3xl mb-12 flex flex-col sm:flex-row justify-between items-end gap-4'>
        <Title text1={'ORDER'} text2={'HISTORY'}/>
        <p className='text-xs font-black text-slate-400 uppercase tracking-[0.2em]'>Showing your latest journeys</p>
      </div>

      <div className='space-y-12'>
        <AnimatePresence mode='popLayout'>
          {orderData.length > 0 ? (
            orderData.map((order, index) => {
              const statusStyle = getStatusStyle(order.status);
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={order._id} 
                  className='bg-white dark:bg-[#080808] rounded-[2.5rem] border border-gray-100 dark:border-gray-900 shadow-sm hover:shadow-2xl transition-all overflow-hidden group'
                >
                  {/* Order Header */}
                  <div className='p-6 sm:p-8 border-b dark:border-gray-900 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-6'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 sm:gap-3'>
                        <span className='px-2 sm:px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-tighter'>Order</span>
                        <h3 className='text-base sm:text-lg font-black dark:text-white uppercase tracking-tighter'>#{order._id.slice(-8).toUpperCase()}</h3>
                      </div>
                      <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5'>{new Date(order.date).toDateString()}</p>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
                        <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl ${statusStyle.bg} border border-transparent transition-all`}>
                          <p className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${statusStyle.dot} animate-pulse`}/ >
                          <p className={`text-[10px] sm:text-sm font-black uppercase tracking-widest ${statusStyle.text}`}>{order.status}</p>
                        </div>
                        <div className='hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-800'/>
                        <div className='flex flex-col items-end'>
                            <p className='text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1'>Total Paid</p>
                            <p className='text-lg sm:text-xl font-black dark:text-white'>{currency}{order.amount.toLocaleString()}</p>
                        </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className='p-6 sm:p-8 space-y-8'>
                    {order.items.map((item, idx) => (
                      <div key={idx} className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 group/item'>
                        <div className='flex items-center gap-6'>
                          <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm'>
                            <img className='w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700' src={item.image[0]} alt={item.name} />
                          </div>
                          <div className='space-y-1'>
                            <h4 className='font-black text-base sm:text-lg dark:text-white uppercase tracking-tight leading-tight'>{item.name}</h4>
                            <div className='flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400'>
                              <span>Size: <span className='text-slate-800 dark:text-slate-200'>{item.size}</span></span>
                              <span className='w-1 h-1 rounded-full bg-slate-200 dark:bg-gray-800'/>
                              <span>Qty: <span className='text-slate-800 dark:text-slate-200'>{item.quantity}</span></span>
                              <span className='w-1 h-1 rounded-full bg-slate-200 dark:bg-gray-800'/>
                              <span>{currency}{item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                           <button className='px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-slate-100 dark:border-gray-900 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95'>
                             View Product
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Action */}
                  <div className='px-8 py-6 bg-slate-50/50 dark:bg-white/[0.01] border-t dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>Payment via: <span className='text-slate-800 dark:text-slate-200'>{order.paymentMethod}</span></p>
                    <button 
                      onClick={loadOrderData} 
                      className='w-full sm:w-auto px-10 py-4 text-xs font-black uppercase tracking-[0.3em] rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/5 dark:shadow-white/5'
                    >
                      Refresh Details
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className='text-center py-32'>
              <div className='w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 dark:text-gray-600 animate-pulse'>
                <IconReceipt className="w-12 h-12 opacity-70" />
              </div>
              <h3 className='text-2xl font-black dark:text-white uppercase tracking-[0.2em]'>Empty History</h3>
              <p className='text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest'>Your style story hasn't started yet.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Orders

