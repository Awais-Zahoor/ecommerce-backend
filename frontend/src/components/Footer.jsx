import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Footer = () => {
  const { branding, backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/elite/subscribe', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Subscription failed.');
    }
    setLoading(false);
  };

  return (
    <footer className='w-full mt-24 sm:mt-32 pb-10 bg-white dark:bg-[#050505] text-gray-800 dark:text-gray-200 transition-colors duration-500 border-t border-gray-100 dark:border-gray-900'>
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16'>
        
        {/* Minimalist Grid */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20'>
          
          {/* Identity */}
          <div className='md:col-span-2 space-y-8 text-center md:text-left pr-0 md:pr-10'>
            <Link to="/" className='inline-block transition-opacity hover:opacity-80'>
                {branding.logo && (
                    <img src={branding.logo} className='h-8 sm:h-10 w-auto object-contain mx-auto md:mx-0' alt="Awais Mart" />
                )}
            </Link>
            <p className='text-[10px] leading-relaxed text-gray-500 dark:text-gray-400 uppercase font-bold tracking-[0.2em] max-w-sm mx-auto md:mx-0'>
                The intersection of timeless craftsmanship <br className='hidden lg:block'/> and modern luxury curation.
            </p>
            <p className='text-[12px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto md:mx-0 mt-4'>
                Our commitment is to deliver exceptional quality and unparalleled style. Discover collections crafted with passion and precision, tailored for those who appreciate the finer things in life.
            </p>
          </div>

          {/* Navigation */}
          <div className='space-y-6 text-center md:text-left'>
            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white'>Explore</h4>
            <div className='flex flex-col gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                <Link to="/" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Home</Link>
                <Link to="/collection" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Collections</Link>
                <Link to="/about" className='hover:text-black dark:hover:text-white transition-colors duration-300'>The Story</Link>
                <Link to="/wishlist" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Wishlist</Link>
            </div>
          </div>

          {/* Assistance */}
          <div className='space-y-6 text-center md:text-left'>
            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white'>Assistance</h4>
            <div className='flex flex-col gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                <Link to="/orders" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Track Order</Link>
                <Link to="/contact" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Concierge</Link>
                <Link to="/cart" className='hover:text-black dark:hover:text-white transition-colors duration-300'>Shopping Cart</Link>
                <Link to="/login" className='hover:text-black dark:hover:text-white transition-colors duration-300'>My Account</Link>
            </div>
          </div>

        </div>

        {/* Middle Strip: Newsletter & Socials */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-100 dark:border-gray-900 pt-12 mb-12 items-center'>
            <form onSubmit={handleSubscribe} className='flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3 w-full max-w-sm mx-auto md:mx-0'>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER EMAIL ADDRESS" 
                    required
                    className='bg-transparent outline-none text-[10px] font-black tracking-widest w-full text-gray-900 dark:text-white placeholder:text-gray-400'
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className='text-[10px] font-black text-indigo-500 hover:text-black dark:hover:text-white transition-colors tracking-widest uppercase disabled:opacity-50 min-w-[70px]'
                >
                    {loading ? '...' : 'Subscribe'}
                </button>
            </form>

            <div className='flex justify-center md:justify-end flex-wrap gap-x-8 gap-y-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500'>
                 <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='hover:text-indigo-500 transition-colors'>Instagram</a>
                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className='hover:text-indigo-500 transition-colors'>Twitter</a>
                 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='hover:text-indigo-500 transition-colors'>Facebook</a>
                 <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className='hover:text-indigo-500 transition-colors'>TikTok</a>
            </div>
        </div>

        {/* Bottom Legal Strip */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 text-center'>
            <p className='text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600'>
                &copy; {new Date().getFullYear()} Awais Mart Luxury Group.
            </p>
            <div className='flex gap-6 items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] p-2 px-6 rounded-full border border-gray-100 dark:border-gray-900'>
                 <img src={assets.stripe_logo} className='h-3 opacity-40 grayscale dark:brightness-200' alt="Stripe" />
            </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer