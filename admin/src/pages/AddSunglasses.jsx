import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const AddSunglasses = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [frameType, setFrameType] = useState("Aviator");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [bestseller, setBestseller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("brand", brand)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("frameType", frameType)
      formData.append("stockQuantity", stockQuantity)
      formData.append("isBestseller", bestseller)
      
      image1 && formData.append("images", image1)
      image2 && formData.append("images", image2)
      image3 && formData.append("images", image3)
      image4 && formData.append("images", image4)
      
      const response = await axios.post(backendUrl + "/api/sunglasses/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 animate-reveal'>
        <div className='flex items-center gap-3 mb-2'>
            <div className='w-1 h-8 bg-indigo-600 rounded-full' />
            <h2 className='text-2xl font-black uppercase tracking-tighter'>Forge Eyewear Masterpiece</h2>
        </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 w-full'>
          <div className='space-y-6'>
              <div className='bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm'>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>Professional AR Views (Required PNGs)</p>
                  <div className='flex flex-wrap gap-4'>
                    {[
                        { id: 1, label: 'Front View (AR)' },
                        { id: 2, label: 'Left Side (AR)' },
                        { id: 3, label: 'Right Side (AR)' },
                        { id: 4, label: 'Optional' }
                    ].map((item, idx) => {
                        const img = [image1, image2, image3, image4][idx];
                        return (
                            <label key={idx} htmlFor={`image${item.id}`} className='relative group cursor-pointer'>
                                <div className='w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500 bg-gray-50/50 dark:bg-black/20'>
                                    {img ? (
                                        <img className='w-full h-full object-cover' src={URL.createObjectURL(img)} alt="" />
                                    ) : (
                                        <>
                                            <img className='w-8 h-8 opacity-20 mb-2' src={assets.upload_area} alt="" />
                                            <span className='text-[8px] font-black uppercase tracking-tighter text-gray-400'>{item.label}</span>
                                        </>
                                    )}
                                </div>
                                <input onChange={(e) => [setImage1, setImage2, setImage3, setImage4][idx](e.target.files[0])} type="file" id={`image${item.id}`} hidden />
                            </label>
                        )
                    })}
                  </div>
                  <div className='mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-500/20'>
                      <p className='text-[9px] font-bold text-indigo-600 dark:text-indigo-400'>TIP: Use transparent PNGs for the best AR experience. The system will automatically switch views based on the customer's movement.</p>
                  </div>
              </div>
          </div>

          <div className='space-y-6'>
              <div className='bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-5'>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Product Identity</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold placeholder:opacity-30' type="text" placeholder='Model Designation' required />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Brand House</p>
                    <input onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold placeholder:opacity-30' type="text" placeholder='Ray-Ban, Gucci, etc.' required />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Narrative Description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold h-24 no-scrollbar' placeholder='The philosophy of this piece...' required />
                  </div>
              </div>

              <div className='bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-6'>
                  <div className='col-span-2'>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Architectural Type</p>
                    <select onChange={(e) => setFrameType(e.target.value)} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold appearance-none'>
                        <option value="Aviator">Aviator</option>
                        <option value="Wayfarer">Wayfarer</option>
                        <option value="Round">Round</option>
                        <option value="Square">Square</option>
                        <option value="Cat-Eye">Cat-Eye</option>
                        <option value="Sport">Sport</option>
                    </select>
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Valuation</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold' type="Number" placeholder='5000' required />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2'>Inventory</p>
                    <input onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} className='w-full px-5 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold' type="Number" placeholder='10' required />
                  </div>
              </div>

              <div className='flex items-center justify-between px-6'>
                  <div className='flex gap-3'>
                    <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-5 h-5 accent-indigo-600' />
                    <label className='text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer text-gray-500' htmlFor="bestseller">Elite Bestseller Status</label>
                  </div>
                  <button type="submit" className='bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all'>Register Piece</button>
              </div>
          </div>
      </div>
    </form>
  )
}

export default AddSunglasses
