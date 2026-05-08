import React from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import Categories from '../components/Categories'
import CategoryShowcase from '../components/CategoryShowcase'
import { assets } from '../assets/assets'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Hero/>
      <BestSeller/>
      <Categories/>
      <CategoryShowcase/>

      {/* ── Premium Hero Banner Above Latest Collection ── */}
      <div className='mt-16 mb-8 px-4 sm:px-0'>
        <div className='relative w-full h-[300px] overflow-hidden shadow-2xl group'>
          <img 
            src={assets.artistic_banner} 
            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10000ms]' 
            alt="Latest Collection Banner" 
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-center p-8 sm:p-16'>
            <div className='max-w-2xl space-y-4 animate-reveal'>
              <p className='text-indigo-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.5em]'>Season 2024</p>
              <h2 className='text-4xl sm:text-6xl font-black text-white leading-none uppercase tracking-tighter'>The Latest<br/>Anthology</h2>
              <p className='text-gray-300 text-[10px] sm:text-xs font-medium max-w-md uppercase tracking-widest opacity-80'>Explore our newest curated selections and artisanal masterpieces.</p>
            </div>
          </div>
        </div>
      </div>

      <LatestCollection/>
      
      {/* ── Elegant Outfit Builder CTA Section ── */}
      <section className='my-32 px-4 sm:px-0'>
        <div 
          onClick={() => navigate('/outfit-builder')}
          className='relative w-full h-[500px] overflow-hidden cursor-pointer group shadow-[0_40px_100px_-20px_rgba(79,70,229,0.2)] flex items-center justify-center text-center'
        >
          {/* Base Cinematic Background */}
          <div className='absolute inset-0 bg-[#0a0a14]'></div>
          
          {/* Dynamic Mesh Gradients */}
          <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow'></div>
          <div className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow' style={{ animationDelay: '3s' }}></div>
          
          {/* Architectural Lines */}
          <div className='absolute inset-0 opacity-10 pointer-events-none' style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '60px 60px'}}></div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full rotate-45 scale-150 opacity-30'></div>

          <div className='relative z-10 p-10 max-w-4xl space-y-10 animate-reveal flex flex-col items-center'>
              <div className='inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl'>
                  <span className='w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]'></span>
                  <span className='text-gray-300 text-[9px] font-black uppercase tracking-[0.6em]'>AI Virtual Styling Studio</span>
              </div>
              
              <div className='space-y-4'>
                <h2 className='text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none'>
                  Style Your
                </h2>
                <h2 className='text-5xl md:text-7xl font-prata italic text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 via-indigo-400 to-indigo-600 leading-none pb-4'>
                  Masterpiece
                </h2>
              </div>

              <p className='text-gray-400 text-[10px] md:text-xs font-medium max-w-md leading-relaxed uppercase tracking-[0.2em] opacity-80'>
                Step into our interactive studio. Mix, match, and curate your ultimate ensemble with state-of-the-art virtual precision.
              </p>

              <div className='pt-2'>
                <button className='group/btn relative overflow-hidden px-12 py-5 bg-white text-indigo-950 font-black text-[10px] uppercase tracking-[0.4em] rounded-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95'>
                  <span className='relative z-10'>Enter Studio</span>
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500'></div>
                </button>
              </div>
          </div>
        </div>
      </section>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home