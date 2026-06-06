import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success("Product deleted successfully")
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const updateStock = async (id, newQuantity) => {
    if (newQuantity < 0) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/update-stock', { id, stockQuantity: newQuantity }, { headers: { token } })
      if (response.data.success) {
        setList(prev => prev.map(item => item._id === id ? { ...item, stockQuantity: newQuantity, inStock: newQuantity > 0 } : item))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleBestseller = async (id, currentStatus) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/update-status', { id, field: 'bestseller', value: !currentStatus }, { headers: { token } })
      if (response.data.success) {
        setList(prev => prev.map(item => item._id === id ? { ...item, bestseller: !currentStatus } : item))
        toast.success(`Product ${!currentStatus ? 'added to' : 'removed from'} bestsellers`)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update bestseller status")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const filteredList = list.filter(item => {
    const search = searchTerm.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.subCategory.toLowerCase().includes(search) ||
      (item.profession && item.profession.toLowerCase().includes(search))
    );
  });

  return (
    <div className='p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn'>
      
      {/* Header & Search */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Product Catalog</h1>
          <p className='text-sm text-gray-500 mt-1'>Efficient Inventory Management</p>
        </div>
        
        <div className='relative flex-1 max-w-md'>
          {/* SEARCH ICON - CORRECTLY ALIGNED INSIDE */}
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
            <svg className='w-4.5 h-4.5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm'
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Total Products</p>
          <p className='text-xl font-bold mt-1 text-gray-900 dark:text-white'>{list.length}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Out of Stock</p>
          <p className='text-xl font-bold mt-1 text-rose-500'>{list.filter(i => !i.inStock).length}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Active</p>
          <p className='text-xl font-bold mt-1 text-emerald-500'>{list.filter(i => i.inStock).length}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Best Sellers</p>
          <p className='text-xl font-bold mt-1 text-amber-500'>{list.filter(i => i.bestseller).length}</p>
        </div>
      </div>

      {/* Clean Professional Table / Mobile Cards */}
      {filteredList.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className='hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Product</th>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell'>Category</th>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Price</th>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center'>Featured</th>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center'>Inventory</th>
                    <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                  {filteredList.map((item) => (
                    <tr key={item._id} className='hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <img className='w-12 h-12 rounded-lg object-cover bg-gray-100' src={item.image[0]} alt="" />
                          <div>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white'>{item.name}</p>
                            <p className='text-[10px] text-gray-500'>{item.subCategory} • {item.profession}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 hidden md:table-cell'>
                        <span className='px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase'>
                          {item.category}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm font-bold text-gray-900 dark:text-white'>
                        {currency}{item.price.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <button 
                          onClick={() => toggleBestseller(item._id, item.bestseller)}
                          className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${item.bestseller ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-300 hover:text-gray-400'}`}
                          title={item.bestseller ? "Remove from Bestsellers" : "Add to Bestsellers"}
                        >
                          <svg className="w-6 h-6" fill={item.bestseller ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col items-center gap-1.5'>
                          <div className='flex items-center gap-1.5 sm:gap-3'>
                            <button onClick={() => updateStock(item._id, item.stockQuantity - 10)} className='w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all text-xs sm:text-sm' title="-10">-</button>
                            <span className={`text-xs sm:text-sm font-bold w-6 sm:w-10 text-center ${item.stockQuantity <= 5 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>{item.stockQuantity}</span>
                            <button onClick={() => updateStock(item._id, item.stockQuantity + 10)} className='w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-200 transition-all text-xs sm:text-sm' title="+10">+</button>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <span className={`w-1 h-1 rounded-full ${item.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                            {item.inStock ? 'Active' : 'Out'}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button onClick={() => navigate(`/edit/${item._id}`)} className='p-2 text-gray-400 hover:text-indigo-600 transition-colors' title="Edit">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => removeProduct(item._id)} className='p-2 text-gray-400 hover:text-rose-600 transition-colors' title="Delete">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards List View */}
          <div className='grid grid-cols-1 gap-4 lg:hidden'>
            {filteredList.map((item) => (
              <div key={item._id} className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden'>

                {/* Product Info Row */}
                <div className='flex items-center gap-4 p-4'>
                  <img className='w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 shrink-0' src={item.image[0]} alt="" />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-white leading-tight'>{item.name}</h3>
                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5'>{item.subCategory} · {item.category}</p>
                      </div>
                      <p className='text-base font-black text-gray-900 dark:text-white shrink-0'>{currency}{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Inventory Row */}
                <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800'>
                  <span className='text-[10px] font-black text-gray-400 uppercase tracking-wider mr-1'>Inventory</span>
                  <button
                    onClick={() => updateStock(item._id, item.stockQuantity - 10)}
                    className='w-9 h-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 active:scale-95 transition-all'
                    title="Decrease by 10"
                  >−</button>
                  <span className={`text-sm font-black min-w-[2.5rem] text-center ${item.stockQuantity <= 5 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                    {item.stockQuantity}
                  </span>
                  <button
                    onClick={() => updateStock(item._id, item.stockQuantity + 10)}
                    className='w-9 h-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 active:scale-95 transition-all'
                    title="Increase by 10"
                  >+</button>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${item.inStock ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {/* Bestseller star — pushed to right */}
                  <button
                    onClick={() => toggleBestseller(item._id, item.bestseller)}
                    title={item.bestseller ? 'Remove from Bestsellers' : 'Add to Bestsellers'}
                    className={`ml-auto w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 ${item.bestseller ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'}`}
                  >
                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/>
                    </svg>
                  </button>
                </div>

                {/* Actions Row */}
                <div className='grid grid-cols-2 border-t border-gray-100 dark:border-gray-800'>
                  <button
                    onClick={() => navigate(`/edit/${item._id}`)}
                    className='flex items-center justify-center gap-2 py-3 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-r border-gray-100 dark:border-gray-800 active:scale-95'
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' /></svg>
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className='flex items-center justify-center gap-2 py-3 text-rose-500 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors active:scale-95'
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' /></svg>
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
          <p className='text-gray-400 text-sm font-medium'>No products found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default List
