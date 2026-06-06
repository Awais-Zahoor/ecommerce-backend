import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import hero_1 from '../assets/hero_1.png'

const Hero = () => {
  const { navigate, branding } = useContext(ShopContext);

  // Use dynamic branding values or fallbacks
  const heroImage = branding?.heroBanner || '';
  const title = branding?.heroTitle || '';
  const subtitle = branding?.heroSubtitle || '';
  const buttonText = branding?.heroButtonText || '';

  return (
    <div className='relative w-full h-[480px] sm:h-[600px] md:h-[750px] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] bg-[#1a1a1a] mb-8 sm:mb-12 lg:mb-20 shadow-2xl group'>
      
      {/* ── Background Color Split ── */}
      <div className='absolute inset-0 flex flex-col md:flex-row'>
        <div className='w-full md:w-[45%] h-full bg-[#1a1a1a] flex flex-col justify-center px-6 sm:px-10 md:px-20 z-10'>
           {/* Text Content */}
           {(title || subtitle || buttonText) ? (
             <div className='space-y-8 animate-reveal'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-px bg-[#D2B48C]'></div>
                  <p className='text-[#D2B48C] text-[10px] font-black uppercase tracking-[0.5em]'>Limited Edition</p>
                </div>
                
                {title && (
                  <h1 className='text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] whitespace-pre-line'>
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className='text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest leading-loose max-w-xs sm:max-w-sm'>
                    {subtitle}
                  </p>
                )}

                {buttonText && (
                  <div className='pt-4'>
                    <button onClick={() => navigate('/collection')} className='px-7 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 bg-[#D2B48C] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 active:scale-95'>
                      {buttonText}
                    </button>
                  </div>
                )}
             </div>
           ) : null}
        </div>

        {/* Model Side */}
        <div className='w-full md:w-[55%] h-full relative overflow-hidden'>
           {heroImage ? (
             <img src={heroImage} className='w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[3000ms]' alt="Hero Model" />
           ) : null}
           {/* Subtle Vignette */}
           <div className='absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1a1a1a]/30'></div>
           
           {/* Decorative 'X' Pattern Overlay */}
           <div className='absolute top-10 right-10 flex gap-4 opacity-30'>
             <span className='text-4xl font-light text-white select-none'>×</span>
             <span className='text-4xl font-light text-white select-none'>×</span>
           </div>
           <div className='absolute bottom-10 left-10 flex gap-4 opacity-30'>
             <span className='text-4xl font-light text-white select-none'>×</span>
           </div>
        </div>
      </div>

      {/* ── Footer Element ── */}
      <div className='absolute bottom-12 right-12 z-20 hidden md:block'>
        <div className='flex flex-col items-end gap-2'>
           <p className='text-white/20 text-[8px] font-black tracking-[0.6em] uppercase'>Editorial Collection 2026</p>
           <div className='w-20 h-0.5 bg-white/10 rounded-full overflow-hidden'>
              <div className='w-1/3 h-full bg-[#D2B48C]'></div>
           </div>
        </div>
      </div>

      {/* Professional Social Bar */}
      <div className='absolute left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-12 items-center'>
         <div className='w-px h-20 bg-white/20'></div>
         <p className='rotate-90 text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] whitespace-nowrap'>Follow Us</p>
         <div className='w-px h-20 bg-white/20'></div>
      </div>

    </div>
  )
}

export default Hero