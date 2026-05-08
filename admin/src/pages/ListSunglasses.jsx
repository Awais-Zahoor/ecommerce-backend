import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ListSunglasses = ({ token }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/sunglasses/list')
      if (response.data.success) {
        setList(response.data.sunglasses.reverse());
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeSunglasses = async (id) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/sunglasses/remove', { id }, { headers: { token } })
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

  useEffect(() => {
    fetchList()
  }, [])

  const filteredList = list.filter(item => {
    const search = searchTerm.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.brand.toLowerCase().includes(search)
    );
  });

  return (
    <div className='p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn'>
      
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Eyewear Collection</h1>
          <p className='text-sm text-gray-500 mt-1'>Manage your luxury sunglasses catalog</p>
        </div>
        
        <div className='relative flex-1 max-w-md'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
            <svg className='w-4.5 h-4.5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search eyewear..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm'
          />
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Eyewear</th>
                <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell'>Department</th>
                <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>Price</th>
                <th className='px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center'>Stock</th>
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
                        <p className='text-[10px] text-gray-500'>{item.brand}</p>
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
                    <span className={`text-sm font-bold ${item.stock <= 5 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>{item.stock}</span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button onClick={() => navigate(`/edit-sunglasses/${item._id}`)} className='p-2 text-gray-400 hover:text-indigo-600 transition-colors' title="Edit">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => removeSunglasses(item._id)} className='p-2 text-gray-400 hover:text-rose-600 transition-colors' title="Delete">
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
    </div>
  )
}

export default ListSunglasses
