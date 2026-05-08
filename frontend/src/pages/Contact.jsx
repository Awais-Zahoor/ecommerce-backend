import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/contact/submit', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='transition-all duration-500 bg-white dark:bg-gray-950 min-h-screen'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20'>
        
        {/* ── SECTION 1: Location & Identity (Architectural Symmetry) ── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch'>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl h-[400px] lg:h-full group relative'
          >
            <div className='absolute inset-0 bg-violet-500/[0.02] pointer-events-none z-10' />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13606.326848148332!2d74.3396781432135!3d31.508197779782572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a28ad177b%3A0xc660d5b121fb6ba6!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              className='w-full h-full grayscale dark:invert dark:opacity-60 hover:grayscale-0 dark:hover:invert-0 dark:hover:opacity-100 transition-all duration-1000 outline-none border-none scale-105 group-hover:scale-100'
              allowFullScreen="" loading="lazy" title="Store Location"
            ></iframe>
            <div className='absolute top-8 left-8 z-20 bg-white/90 dark:bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-100 dark:border-gray-800 shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-violet-500'>Global Flagship • Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className='flex flex-col gap-8 h-full'
          >
            <div className='flex-1 p-12 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-2xl shadow-indigo-500/[0.03] flex flex-col justify-between group transition-all hover:border-[#4f46e5]/30'>
              <div>
                <p className='text-[11px] font-black text-violet-600 uppercase tracking-[0.3em] mb-6'>Primary Residency</p>
                <h3 className='text-4xl font-prata text-[#1e1b4b] dark:text-white leading-tight uppercase tracking-tight'>Block L, Gulberg III, <br />Lahore, Pakistan</h3>
                <div className='h-px w-20 bg-violet-600/30 mt-8' />
              </div>
              <div className='flex items-center gap-5 mt-12'>
                <div className='w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500'>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-widest text-violet-600'>Concierge Status</p>
                  <p className='text-xs font-bold text-[#475569] dark:text-gray-400 uppercase tracking-widest'>Open for Consultations</p>
                </div>
              </div>
            </div>

            <div className='p-12 rounded-[2rem] bg-[#1e1b4b] text-white shadow-2xl flex flex-col justify-between h-56 group relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000' />
              <div className='relative z-10'>
                <p className='text-[11px] font-black text-violet-400 uppercase tracking-[0.3em] mb-4'>Direct Line</p>
                <a href="tel:+923071443372" className='text-3xl font-bold hover:text-violet-400 transition-colors tracking-tight'>+92 307 1443372</a>
              </div>
              <div className='flex items-center gap-5 relative z-10 mt-8'>
                <div className='w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all duration-500'>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className='text-[10px] font-black uppercase tracking-widest text-white/40'>Priority Assistance Desk</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 2: Professional Boutique Form (Focused & Centered) ── */}
        <div className='max-w-4xl mx-auto w-full'>
          <motion.div
            onMouseMove={handleMouseMove}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className='relative group overflow-hidden bg-white dark:bg-gray-900 border-2 border-violet-600/10 dark:border-violet-500/20 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(139,92,246,0.1)]'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-white to-white dark:from-violet-500/[0.02] dark:via-gray-900 dark:to-gray-900 pointer-events-none' />
            <div 
              className='absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 w-[1000px] h-[1000px] bg-violet-600/[0.04] rounded-full blur-[160px]'
              style={{ left: mousePos.x - 500, top: mousePos.y - 500 }}
            />
            
            <div className='relative z-10 p-10 sm:p-16'>
              <div className='mb-12 text-center'>
                <div className='inline-flex items-center gap-4 px-5 py-2 bg-gray-50 dark:bg-violet-500/10 rounded-full border border-gray-100 dark:border-violet-500/20 mb-6'>
                  <span className='w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse' />
                  <span className='text-[10px] font-black text-violet-600 uppercase tracking-[0.3em]'>Direct Inquiry Channel</span>
                </div>
                <h2 className='text-3xl sm:text-4xl font-prata text-[#1e1b4b] dark:text-white tracking-tighter leading-tight mb-4 uppercase'>Send us a Message</h2>
                <div className='h-1 w-16 bg-violet-600 rounded-full mb-6 mx-auto' />
                <p className='text-base text-[#475569] dark:text-gray-400 leading-relaxed font-medium max-w-2xl mx-auto'>Our team will respond to your transmission with elite priority and uncompromised excellence.</p>
              </div>

              <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-8'>
                  <div className='space-y-3'>
                    <label className='text-[9px] font-black uppercase tracking-[0.2em] text-violet-600 block ml-1'>Full Name</label>
                    <input type="text" required placeholder="Enter your name"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className='w-full bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4 outline-none text-base font-bold text-[#1e1b4b] dark:text-white placeholder-[#94a3b8] focus:border-violet-600 focus:ring-4 focus:ring-violet-600/5 transition-all shadow-sm'
                    />
                  </div>

                  <div className='space-y-3'>
                    <label className='text-[9px] font-black uppercase tracking-[0.2em] text-violet-600 block ml-1'>Email Address</label>
                    <input type="email" required placeholder="name@company.com"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className='w-full bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4 outline-none text-base font-bold text-[#1e1b4b] dark:text-white placeholder-[#94a3b8] focus:border-violet-600 focus:ring-4 focus:ring-violet-600/5 transition-all shadow-sm'
                    />
                  </div>
                </div>

                <div className='space-y-8 flex flex-col'>
                  <div className='space-y-3 flex-1'>
                    <label className='text-[9px] font-black uppercase tracking-[0.2em] text-violet-600 block ml-1'>Message Body</label>
                    <textarea rows={5} required placeholder="How can we assist you?"
                      value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className='w-full h-[calc(100%-2.5rem)] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4 outline-none text-base font-bold text-[#1e1b4b] dark:text-white placeholder-[#94a3b8] focus:border-violet-600 focus:ring-4 focus:ring-violet-600/5 transition-all shadow-sm resize-none'
                    />
                  </div>
                </div>

                <div className='md:col-span-2 pt-4 flex flex-col sm:flex-row items-center justify-between gap-8'>
                  <button type='submit'
                    className='group/btn relative h-16 px-12 bg-violet-600 overflow-hidden rounded-xl shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 active:scale-[0.98] transition-all w-full sm:w-auto'
                  >
                    <div className='absolute inset-0 bg-[#1e1b4b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-in-out' />
                    <div className='relative z-10 flex items-center justify-center gap-4'>
                      <span className='text-[10px] font-black uppercase tracking-[0.3em] text-white'>Send Message</span>
                      <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>

                  <div className='flex items-center gap-10 py-6 pr-6 border-l border-gray-100 dark:border-white/5 pl-10 hidden sm:flex'>
                    <div className='flex items-center gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                      <p className='text-[9px] font-black uppercase tracking-widest text-violet-600'>Secure End-to-End</p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                      <p className='text-[9px] font-black uppercase tracking-widest text-violet-600'>Verified Management</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 3: Career Opportunities (Standard Presentation) ── */}
        <div className='my-10 flex flex-col justify-center md:flex-row gap-14 mb-28 items-center'>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='w-full md:max-w-[480px] rounded-[2rem] overflow-hidden shadow-2xl border dark:border-gray-800'
          >
            <img className='w-full hover:scale-105 transition-transform duration-1000' src={assets.contact_img} alt="Careers" />
          </motion.div>
          
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className='flex flex-col justify-center items-start gap-8 max-w-lg'
          >
            <div>
              <p className='text-[11px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4'>Professional Growth</p>
              <h3 className='text-3xl sm:text-4xl font-prata text-[#1e1b4b] dark:text-white uppercase leading-tight'>Careers at Awais Mart</h3>
              <div className='h-1 w-16 bg-violet-600 rounded-full mt-6' />
            </div>
            
            <p className='text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium'>We are perpetually seeking artisan-grade talent to join our expanding collective of dedicated luxury specialists.</p>
            
            <button className='group relative overflow-hidden border-2 border-[#1e1b4b] dark:border-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 hover:text-white focus:outline-none'>
              <div className='absolute inset-0 bg-[#1e1b4b] dark:bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out' />
              <span className='relative z-10 group-hover:text-white dark:group-hover:text-black'>Explore Job Openings</span>
            </button>
          </motion.div>
        </div>

      </div>

      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className='pb-20'
      >
        <NewsletterBox />
      </motion.div>
    </motion.div>
  )
}

export default Contact