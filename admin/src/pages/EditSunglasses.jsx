import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const EditSunglasses = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [frameType, setFrameType] = useState("Aviator");
  const [stockQuantity, setStockQuantity] = useState("");
  const [bestseller, setBestseller] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/sunglasses/single/${id}`)
        if (response.data.success) {
          const item = response.data.sunglasses
          setName(item.name)
          setBrand(item.brand)
          setDescription(item.description)
          setPrice(item.price)
          setFrameType(item.frameType)
          setStockQuantity(item.stockQuantity)
          setBestseller(item.isBestseller)
        }
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch details")
        navigate('/list-sunglasses')
      }
    }
    fetchDetails()
  }, [id, navigate])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name, brand, description, price: Number(price),
        frameType, stockQuantity: Number(stockQuantity),
        isBestseller: bestseller,
      }

      const response = await axios.post(`${backendUrl}/api/sunglasses/update/${id}`, updateData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list-sunglasses')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) return <div className='flex justify-center py-20'>Loading...</div>

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 animate-reveal'>
        <div className='flex items-center gap-2 mb-4'>
            <h2 className='text-xl font-black uppercase tracking-widest'>Edit Eyewear</h2>
            <span className='px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full'>Universal Mode</span>
        </div>

      <div className='w-full max-w-[500px] space-y-4'>
        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4'>
            <div>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Product Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold' type="text" required />
            </div>

            <div>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Brand</p>
                <input onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold' type="text" required />
            </div>

            <div>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Description</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold h-32' required />
            </div>
        </div>

        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4'>
            <div>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Price</p>
                <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold' type="number" required />
            </div>
            <div>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Stock</p>
                <input onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold' type="number" required />
            </div>
            <div className='col-span-2'>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-2'>Frame Type</p>
                <select onChange={(e) => setFrameType(e.target.value)} value={frameType} className='w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold'>
                    <option value="Aviator">Aviator</option>
                    <option value="Wayfarer">Wayfarer</option>
                    <option value="Round">Round</option>
                    <option value="Square">Square</option>
                    <option value="Cat-Eye">Cat-Eye</option>
                    <option value="Sport">Sport</option>
                </select>
            </div>
        </div>

        <div className='flex items-center gap-2 px-6'>
            <input type="checkbox" id='bestseller' checked={bestseller} onChange={()=>setBestseller(!bestseller)} className='w-4 h-4' />
            <label htmlFor="bestseller" className='text-xs font-bold uppercase tracking-widest cursor-pointer'>Feature as Bestseller</label>
        </div>

        <button type="submit" className='w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl'>Update Masterpiece</button>
      </div>
    </form>
  )
}

export default EditSunglasses
