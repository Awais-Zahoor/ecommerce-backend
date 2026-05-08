import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const AddSunglasses = ({ token }) => {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("10")
  const [brand, setBrand] = useState("")
  const [bestseller, setBestseller] = useState(false)
  const [model3D, setModel3D] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!model3D) {
      return toast.error("3D Sunglasses Model (.glb) is strictly required");
    }

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stock", stock)
      formData.append("brand", brand)
      formData.append("bestseller", bestseller)
      formData.append("model3D", model3D)

      const response = await axios.post(backendUrl + "/api/sunglasses/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success("Sunglasses Added (3D Ready)")
        setName('')
        setDescription('')
        setBrand('')
        setPrice('')
        setStock('10')
        setBestseller(false)
        setModel3D(false)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='max-w-4xl animate-reveal pb-20'>
      <div className='mb-10'>
        <h3 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase text-indigo-600'>Sunglasses Engine</h3>
        <p className='text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5'>3D Model Core Upload (No Images Required)</p>
      </div>

      <form onSubmit={onSubmitHandler} className='admin-card p-8 md:p-12 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem]'>
        
        <div className='flex flex-col lg:flex-row gap-16'>
          
          <div className='lg:w-1/3 order-1 lg:order-2'>
            <div className='lg:sticky lg:top-10 space-y-8 bg-gray-50/50 dark:bg-gray-800/20 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50'>
              <div className='flex items-center gap-3 mb-2'>
                <span className='w-1.5 h-4 bg-indigo-600 rounded-full'></span>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]'>3D Asset Core</p>
              </div>
              
              <div className='space-y-4'>
                <label htmlFor="model3D" className='cursor-pointer group'>
                  <div className={`aspect-square border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${model3D ? 'border-emerald-500 bg-emerald-50/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${model3D ? 'bg-emerald-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500'}`}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.27 6.96L12 12.01l8.73-5.05" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22.08V12" />
                      </svg>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${model3D ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {model3D ? model3D.name : 'Upload .GLB Engine'}
                    </span>
                  </div>
                  <input onChange={(e) => setModel3D(e.target.files[0])} type="file" id="model3D" accept=".glb,.gltf" hidden />
                </label>
                {model3D && (
                   <p className='text-[8px] font-bold text-center text-emerald-500 uppercase tracking-widest'>Engine Ready for Live Sync ✓</p>
                )}
              </div>
            </div>
          </div>

          <div className='flex-1 space-y-8 order-2 lg:order-1'>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Eyewear Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="text" placeholder='e.g. Midnight Aviators' required />
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Brand</label>
                <input onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="text" placeholder='e.g. Awais Luxe' required />
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Narrative</label>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none min-h-[120px]' placeholder='Describe the style...' required />
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Valuation ({currency})</label>
                  <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="number" placeholder='0.00' step="0.01" required />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Inventory Count</label>
                  <input onChange={(e) => setStock(e.target.value)} value={stock} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="number" placeholder='10' required />
                </div>
              </div>

              <div className='flex items-center gap-4 py-2'>
                 <div onClick={() => setBestseller(prev => !prev)} className={`w-14 h-8 rounded-full cursor-pointer transition-all duration-300 flex items-center p-1 ${bestseller ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${bestseller ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </div>
                 <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Mark as Bestseller</label>
              </div>
            </div>

            <div className='pt-10 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
               <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/30 active:scale-[0.98] transition-all'>Archive Engine →</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddSunglasses
