import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from './../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Order status updated")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Packing': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Shipped': return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'Out for delivery': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='max-w-7xl animate-reveal'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4'>
        <div>
          <h3 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Orders</h3>
          <p className='text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5'>Order Management & Delivery Tracking</p>
        </div>
        <div className='flex items-center gap-3 bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
          <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Total Orders</span>
          <span className='w-px h-4 bg-gray-100 dark:bg-gray-800 mx-1'></span>
          <span className='text-lg font-black text-indigo-600'>{orders.length}</span>
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        {orders.length === 0 ? (
          <div className='admin-card p-24 text-center'>
            <p className='text-gray-400 font-bold uppercase tracking-widest text-sm'>No orders found.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className='admin-card overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-500/5'>
              
              {/* Header Section */}
              <div className='bg-gray-50/50 dark:bg-gray-800/30 px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700'>
                     <img className='w-6 opacity-70 dark:invert' src={assets.parcel_icon} alt="" />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Order ID</p>
                    <p className='text-sm font-black text-gray-900 dark:text-white font-mono uppercase tracking-tighter'>#{order._id.slice(-10)}</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-6'>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                   </div>
                   <div className='text-right'>
                      <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right'>Timestamp</p>
                      <p className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                        {new Date(order.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        <span className='mx-2 opacity-30'>|</span>
                        {new Date(order.date).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                      </p>
                   </div>
                </div>
              </div>

              {/* Grid Body */}
              <div className='p-8 grid grid-cols-1 lg:grid-cols-3 gap-12'>
                
                {/* Manifest Content */}
                <div>
                  <div className='flex items-center gap-2 mb-6'>
                    <span className='w-1 h-3 bg-indigo-500 rounded-full'></span>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]'>Order Manifest</p>
                  </div>
                  <div className='space-y-3'>
                    {order.items.map((item, idx) => (
                      <div key={idx} className='flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all'>
                        <div className='min-w-0'>
                          <p className='text-sm font-bold text-gray-900 dark:text-gray-100 truncate'>{item.name}</p>
                          <p className='text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tighter'>
                            Size: <span className='text-indigo-600 dark:text-indigo-400 font-black ml-1'>{item.size}</span>
                          </p>
                        </div>
                        <span className='ml-4 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-black text-gray-900 dark:text-white shadow-sm'>
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Section */}
                <div>
                  <div className='flex items-center gap-2 mb-6'>
                    <span className='w-1 h-3 bg-indigo-500 rounded-full'></span>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]'>Shipping Logistics</p>
                  </div>
                  <div className='bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 border-dashed'>
                    <p className='text-lg font-black text-gray-900 dark:text-white mb-2 leading-none'>{order.address.firstName} {order.address.lastName}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-medium'>
                      {order.address.street}<br />
                      {order.address.city}, {order.address.state}<br />
                      <span className='text-gray-400'>{order.address.country} · {order.address.zipcode}</span>
                    </p>
                    <div className='flex items-center gap-3 bg-white dark:bg-gray-900 w-fit px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                       <span className='text-xs font-black text-gray-700 dark:text-gray-300 tracking-tight'>{order.address.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Settlement */}
                <div className='flex flex-col justify-between gap-8 text-right'>
                  <div className='space-y-4'>
                    <div className='flex flex-col items-end gap-1'>
                      <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Order Total</p>
                      <h4 className='text-4xl font-black text-gray-900 dark:text-white tracking-tighter'>{currency}{order.amount.toLocaleString()}</h4>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                       <div className='flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-800'>
                         <span className={`w-2 h-2 rounded-full ${order.payment ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
                         <span className='text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400'>{order.payment ? 'Verified Payment' : 'Pending Verification'}</span>
                       </div>
                       <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Channel: <span className='text-indigo-600'>{order.paymentMethod}</span></span>
                    </div>
                  </div>

                  <div className='space-y-3 mt-auto'>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>Update Status</p>
                    <div className='relative'>
                      <select 
                        onChange={(event) => statusHandler(event, order._id)} 
                        value={order.status} 
                        className='w-full p-4 pl-6 pr-12 font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer appearance-none'
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none'>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
    </div>
  </div>
)
}

export default Orders
