import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const ListSunglasses = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/sunglasses/list')
      if (response.data.success) {
        setList(response.data.sunglasses);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
        const response = await axios.post(backendUrl + '/api/sunglasses/remove', { id }, { headers: { token } })
        if (response.data.success) {
            toast.success(response.data.message)
            await fetchList()
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='animate-reveal'>
      <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
              <div className='w-1 h-8 bg-indigo-600 rounded-full' />
              <h2 className='text-2xl font-black uppercase tracking-tighter'>Eyewear Archive</h2>
          </div>
          <Link to="/add-sunglasses" className='bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl'>New Forge</Link>
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1.5fr_1fr_1.5fr_1fr] items-center py-5 px-8 bg-gray-50/50 dark:bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
          <b>Artifact</b>
          <b>Designation</b>
          <b>House</b>
          <b>Valuation</b>
          <b>Framework</b>
          <b className='text-center'>Actions</b>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-800'>
          {list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1.5fr_1fr_1.5fr_1fr] items-center gap-4 py-6 px-8 hover:bg-gray-50/50 dark:hover:bg-indigo-500/5 transition-colors' key={index}>
              <div className='w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-black border border-gray-100 dark:border-gray-800'>
                <img className='w-full h-full object-cover' src={item.images[0]?.url || item.images[0]} alt="" />
              </div>
              <div>
                  <p className='text-sm font-black dark:text-white uppercase tracking-tight'>{item.name}</p>
                  {item.isBestseller && <span className='text-[8px] font-black text-indigo-500 uppercase tracking-widest'>Bestseller</span>}
              </div>
              <p className='text-xs font-bold text-gray-500 uppercase'>{item.brand}</p>
              <p className='text-sm font-black dark:text-white'>{currency}{item.price.toLocaleString()}</p>
              <div className='flex flex-col'>
                  <p className='text-[10px] font-bold text-gray-400 uppercase'>{item.frameType}</p>
                  <p className='text-[8px] font-bold text-indigo-400 uppercase'>{item.stockQuantity} in vault</p>
              </div>
              <div className='flex items-center justify-center gap-4'>
                  <Link to={`/edit-sunglasses/${item._id}`} className='p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:scale-110 transition-all'>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </Link>
                  <button onClick={() => removeProduct(item._id)} className='p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:scale-110 transition-all'>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {list.length === 0 && (
          <div className='py-40 text-center'>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]'>Archive is currently empty.</p>
          </div>
      )}
    </div>
  )
}

export default ListSunglasses
