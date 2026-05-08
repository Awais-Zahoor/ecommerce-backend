import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { motion } from 'framer-motion'
import { IconBolt, IconHandshake, IconTrophy } from '../components/icons/StoreIcons'

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='transition-all duration-500 pb-20'
    >

      {/* ── Professional Editorial Banner ── */}
      <div className='relative w-full h-[300px] sm:h-[400px] overflow-hidden mb-16 border-b border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-black'>
        <img src={assets.about_banner} className='w-full h-full object-cover opacity-90 dark:opacity-70 scale-105 hover:scale-100 transition-transform duration-1000' alt="About Us Banner" />
        <div className='absolute inset-0 bg-gradient-to-r from-white/90 via-white/20 to-transparent dark:from-black/90 dark:via-black/20 dark:to-transparent flex flex-col justify-center px-[5vw] md:px-[9vw]'>
          <p className='text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4'>Our Identity</p>
          <h1 className='text-4xl md:text-6xl font-black text-gray-950 dark:text-white uppercase tracking-tighter leading-none mb-6'>The Boutique<br/>Story</h1>
          <div className='h-1 w-20 bg-indigo-600 rounded-full'></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <div className='my-10 lg:my-14 flex flex-col md:flex-row gap-10 md:gap-16 items-center'>
        <div className='w-full md:max-w-[450px] relative group'>
            <div className='absolute -inset-2 bg-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity'/>
            <img className='relative w-full rounded-2xl md:rounded-[2rem] shadow-2xl border dark:border-gray-800' src={assets.about_img} alt="About Us" />
        </div>
        <div className='flex flex-col justify-center gap-6 md:gap-8 md:w-2/4'>
          <div className='space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed'>
            <p className='text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]'>Luxury Defined</p>
            <p className='text-base md:text-lg font-medium dark:text-gray-200'>Founded on the principles of curators, Awais Mart was born out of a passion for high-end boutique essentials that bridge the gap between timeless elegance and modern convenience.</p>
            <p className='text-sm md:text-base'>Our journey began with a simple vision: to create a destination where quality isn't just a metric, but a way of life. We painstakingly source every piece in our collection, ensuring that each stitch, material, and finish meets the uncompromising standards of our elite clientele.</p>
          </div>
          
          <div className='p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border dark:border-gray-900 space-y-4'>
             <b className='text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]'>Our Mission</b>
             <p className='text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>To empower the modern connoisseur by providing a curated selection of luxury goods that inspire confidence and reflect an unparalleled level of craftsmanship.</p>
          </div>
        </div>
      </div>

      <div className='flex justify-center text-xl md:text-2xl py-6 md:py-8 transition-colors prata-regular'>
        <Title text1={'WHY LUXURY'} text2={'CURATORS CHOOSE US'}/>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-20'>
        <div className='group relative border dark:border-gray-900 px-8 py-10 md:px-10 md:py-12 rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-gray-950 shadow-xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden'>
          <div className='absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700'/>
          <div className='w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400'>
             <IconTrophy className="w-6 h-6" />
          </div>
          <b className='text-xs font-black dark:text-white uppercase tracking-wider mb-4 block'>Quality Assurance</b>
          <p className='text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold'>Every product undergoes a rigorous 24-point inspection process by our in-house luxury experts.</p>
        </div>

        <div className='group relative border dark:border-gray-900 px-8 py-10 md:px-10 md:py-12 rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-gray-950 shadow-xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden'>
          <div className='absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700'/>
          <div className='w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400'>
             <IconBolt className="w-6 h-6" />
          </div>
          <b className='text-xs font-black dark:text-white uppercase tracking-wider mb-4 block'>Modern Convenience</b>
          <p className='text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold'>Seamless browsing and secure white-glove checkout designed for the luxury digital age.</p>
        </div>

        <div className='group relative border dark:border-gray-900 px-8 py-10 md:px-10 md:py-12 rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-gray-950 shadow-xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden'>
          <div className='absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700'/>
          <div className='w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400'>
             <IconHandshake className="w-6 h-6" />
          </div>
          <b className='text-xs font-black dark:text-white uppercase tracking-wider mb-4 block'>World-Class Service</b>
          <p className='text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold'>Our 24/7 concierge team is always available to assist with your most demanding requests.</p>
        </div>
      </div>

      </div>
      <NewsletterBox/>

    </motion.div>
  )
}

export default About
