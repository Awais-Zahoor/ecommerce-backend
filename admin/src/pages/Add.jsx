import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stockQuantity, setStockQuantity] = useState("1")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [profession, setProfession] = useState("Casual")
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [currentColor, setCurrentColor] = useState("#4f46e5") // Default indigo
  const [colorName, setColorName] = useState("")
  const [brand, setBrand] = useState("")
  const [bestseller, setBestseller] = useState(false)
  const [inStock, setInStock] = useState(true)
  const [activeTab, setActiveTab] = useState('identity') // identity, inventory, attributes

  const tabs = [
    { id: 'identity', label: 'Identity', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'attributes', label: 'Attributes', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17l.354-.354' }
  ]

  const openEyeDropper = async () => {
    if (!window.EyeDropper) {
      toast.info("EyeDropper is not supported in your browser. Please use Chrome or Edge.")
      return
    }
    const eyeDropper = new window.EyeDropper()
    try {
      const result = await eyeDropper.open()
      setCurrentColor(result.sRGBHex)
    } catch (e) {
      console.log("EyeDropper cancelled")
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1 && !image2 && !image3 && !image4) {
      return toast.error("Please upload at least one image");
    }

    if (sizes.length === 0) {
      return toast.error("Please select at least one size");
    }

    if (colors.length === 0) {
      return toast.error("Please add at least one color");
    }

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stockQuantity", stockQuantity)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("profession", profession)
      formData.append("bestseller", bestseller ? "true" : "false")
      formData.append("inStock", (inStock && Number(stockQuantity) > 0) ? "true" : "false")
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("colors", JSON.stringify(colors))
      formData.append("brand", brand)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success("Product added successfully")
        setName('')
        setDescription('')
        setBrand('')
        setPrice('')
        setStockQuantity('1')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizes([])
        setColors([])
        setBestseller(false)
        setInStock(true)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const addColor = (e) => {
    e.preventDefault();
    if (currentColor && !colors.includes(currentColor)) {
      setColors(prev => [...prev, currentColor]);
    }
  }

  const removeColor = (colorToRemove) => {
    setColors(prev => prev.filter(c => c !== colorToRemove));
  }


  return (
    <div className='max-w-4xl animate-reveal pb-20'>
      <div className='mb-10'>
        <h3 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>New Masterpiece</h3>
        <p className='text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5'>Archive a new product into the boutique collection</p>
      </div>

      {/* Pro Tab Switcher */}
      <div className='flex items-center gap-2 mb-8 bg-gray-50/50 dark:bg-gray-800/30 p-1.5 rounded-[2rem] w-fit border border-gray-100 dark:border-gray-800/50'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmitHandler} className='admin-card p-8 md:p-12 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem]'>
        
        <div className='flex flex-col lg:flex-row gap-16'>
          
          {/* Sticky Visual Assets (Right side on Desktop) */}
          <div className='lg:w-1/3 order-1 lg:order-2'>
            <div className='lg:sticky lg:top-10 space-y-8 bg-gray-50/50 dark:bg-gray-800/20 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50'>
              <div className='flex items-center gap-3 mb-2'>
                <span className='w-1.5 h-4 bg-indigo-600 rounded-full'></span>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]'>Live Preview Assets</p>
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                {[image1, image2, image3, image4].map((img, idx) => (
                  <div key={idx} className='group relative'>
                    <label htmlFor={`image${idx+1}`} className='cursor-pointer'>
                      <div className='aspect-square border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:bg-indigo-50/10 transition-all bg-white dark:bg-gray-900/50 shadow-sm'>
                        <img 
                          className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110' 
                          src={!img ? assets.upload_area : URL.createObjectURL(img)} 
                          alt="" 
                        />
                        {!img && (
                          <div className='absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600/5 backdrop-blur-[2px]'>
                              <svg className="w-5 h-5 text-indigo-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          </div>
                        )}
                      </div>
                      <input onChange={(e) => [setImage1, setImage2, setImage3, setImage4][idx](e.target.files[0])} type="file" id={`image${idx+1}`} hidden />
                    </label>
                    
                    {img && (
                      <button 
                        type="button"
                        onClick={openEyeDropper}
                        className='absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all z-10 text-indigo-600'
                        title="Pick Color"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17l.354-.354" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className='text-[8px] font-bold text-gray-400 uppercase text-center tracking-widest leading-relaxed px-4'>Sync visual assets for the masterpiece catalog. Color sampling tool integrated into thumbnails.</p>
            </div>
          </div>

          {/* Form Content (Left side on Desktop) */}
          <div className='flex-1 space-y-12 order-2 lg:order-1 min-h-[500px]'>
            
            {/* Identity Tab Content */}
            {activeTab === 'identity' && (
              <div className='space-y-10 animate-reveal'>
                <div className='flex items-center gap-3'>
                  <span className='w-2 h-2 bg-indigo-600 rounded-full animate-pulse'></span>
                  <p className='text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]'>Masterpiece Identity</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Product Nomenclature</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="text" placeholder='e.g. Signature Silk Overshirt' required />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Brand Authority</label>
                    <input onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="text" placeholder='e.g. Awais Elite' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Creative Narrative</label>
                  <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none min-h-[140px]' placeholder='Describe the craftsmanship...' required />
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Department</label>
                    <select onChange={(e) => setCategory(e.target.value)} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none cursor-pointer appearance-none'>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Classification</label>
                    <select onChange={(e) => setSubCategory(e.target.value)} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none cursor-pointer appearance-none'>
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                      <option value="Summerwear">Summerwear</option>
                    </select>
                  </div>
                </div>

                <div className='pt-6 flex justify-end'>
                   <button type='button' onClick={() => setActiveTab('inventory')} className='bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all'>Next Phase: Inventory →</button>
                </div>
              </div>
            )}

            {/* Inventory Tab Content */}
            {activeTab === 'inventory' && (
              <div className='space-y-10 animate-reveal'>
                <div className='flex items-center gap-3'>
                  <span className='w-2 h-2 bg-amber-500 rounded-full animate-pulse'></span>
                  <p className='text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]'>Valuation & Logistics</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Market Valuation ({currency})</label>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl px-6 py-5 text-xl font-black focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="Number" placeholder='0.00' required />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Available Units</label>
                    <input onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-5 text-xl font-black focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none' type="Number" placeholder='100' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Masterpiece Occasion</label>
                  <select value={profession} onChange={(e) => setProfession(e.target.value)} className='w-full bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none cursor-pointer appearance-none'>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Party">Party</option>
                    <option value="Streetwear">Streetwear</option>
                  </select>
                </div>

                <div className='bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-8 space-y-6'>
                  <div className='flex items-center justify-between' onClick={() => setBestseller(!bestseller)}>
                    <div className='space-y-1'>
                      <p className='text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white'>Featured in Elite Club</p>
                      <p className='text-[9px] font-bold text-gray-400 uppercase tracking-tighter'>Highlight this product as a bestseller</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all duration-500 cursor-pointer relative ${bestseller ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${bestseller ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between' onClick={() => setInStock(!inStock)}>
                    <div className='space-y-1'>
                      <p className='text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white'>Visible on Storefront</p>
                      <p className='text-[9px] font-bold text-gray-400 uppercase tracking-tighter'>Enable public visibility for this SKU</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all duration-500 cursor-pointer relative ${inStock ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${inStock ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>

                <div className='pt-6 flex justify-between'>
                   <button type='button' onClick={() => setActiveTab('identity')} className='text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all'>← Back</button>
                   <button type='button' onClick={() => setActiveTab('attributes')} className='bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all'>Next Phase: Attributes →</button>
                </div>
              </div>
            )}

            {/* Attributes Tab Content */}
            {activeTab === 'attributes' && (
              <div className='space-y-10 animate-reveal'>
                <div className='flex items-center gap-3'>
                  <span className='w-2 h-2 bg-indigo-600 rounded-full animate-pulse'></span>
                  <p className='text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]'>Custom Attributes</p>
                </div>

                <div className='space-y-6'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Size Configuration</label>
                  <div className='flex flex-wrap gap-3'>
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <div key={sz} onClick={() => setSizes(prev => prev.includes(sz) ? prev.filter(item => item != sz) : [...prev, sz])} className={`px-8 py-4 rounded-2xl cursor-pointer font-black transition-all border text-[10px] uppercase tracking-widest active:scale-90 ${sizes.includes(sz) ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20" : "bg-white dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-indigo-300"}`}>{sz}</div>
                    ))}
                  </div>
                </div>

                <div className='space-y-6'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Color Palette</label>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6'>
                      <div className='flex gap-4 items-center'>
                         <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className='w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent appearance-none' />
                         <div className='flex-1'>
                           <p className='text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1'>Selected Hex</p>
                           <p className='text-xs font-black uppercase dark:text-white'>{currentColor}</p>
                         </div>
                         <button onClick={addColor} className='bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg'>Add</button>
                      </div>
                      <div className='flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                        {colors.length === 0 && <p className='text-[10px] font-bold text-gray-300 uppercase tracking-widest'>No colors archived yet</p>}
                        {colors.map((color, idx) => (
                          <div key={idx} className='group relative'>
                            <div className='w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-md' style={{ backgroundColor: color }} />
                            <div onClick={() => removeColor(color)} className='absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-90 hover:scale-110'>&times;</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='bg-indigo-600/5 dark:bg-indigo-500/5 rounded-3xl p-8 border border-indigo-100/50 dark:border-indigo-900/50 flex flex-col justify-center'>
                       <p className='text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 italic'>"Craftsmanship lies in the details."</p>
                       <p className='text-[9px] font-bold text-indigo-400/80 leading-relaxed uppercase tracking-tighter'>Ensure all variants are synchronized before publishing the manifest to the cloud.</p>
                    </div>
                  </div>
                </div>

                <div className='pt-10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center'>
                   <button type='button' onClick={() => setActiveTab('inventory')} className='text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all'>← Back</button>
                   <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/30 active:scale-[0.98] transition-all'>Archive Masterpiece →</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </form>
    </div>
  )
}

export default Add

