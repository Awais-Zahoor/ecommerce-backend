import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { IconGift, IconRocket, IconSparkles } from './icons/StoreIcons'
import axios from 'axios'

const NewsletterBox = () => {
    const { branding, backendUrl } = useContext(ShopContext);
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!email) return;
        
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/elite/subscribe', { email });
            if (response.data.success) {
                setSubmitted(true);
                setEmail('');
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
        }
        setLoading(false);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        const element = document.getElementById('newsletter-box');
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, []);

    return (
        <section
            id='newsletter-box'
            className={`relative w-full overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
            {/* ── Full-width dark background strip ── */}
            <div className='bg-gray-950 dark:bg-black py-20 px-4 sm:px-8 relative'>

                {/* Ambient glow orbs */}
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none'/>
                <div className='absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-400/10 rounded-full blur-[80px] pointer-events-none'/>

                <div className='max-w-3xl mx-auto text-center relative z-10'>

                    {/* Eyebrow */}
                    <div className='inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/5 rounded-full px-4 py-1.5 mb-6'>
                        <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse'/>
                        <span className='text-[10px] font-black text-violet-400 uppercase tracking-[0.25em]'>Exclusive Members</span>
                    </div>

                    {/* Headline */}
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4'>
                        Join the <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400'>{branding?.newsletterTitle || 'Elite Club'}</span>
                    </h2>
                    <p className='text-sm sm:text-base text-gray-400 font-medium max-w-lg mx-auto mb-10 leading-relaxed'>
                        {branding?.newsletterDescription || 'Be the first to access new arrivals, exclusive drops, and members-only offers — curated for those who define style.'}
                    </p>

                    {/* Benefits row */}
                    <div className='flex flex-wrap justify-center gap-6 mb-10'>
                        {[
                            { Icon: IconGift, label: 'Early Access' },
                            { Icon: IconSparkles, label: 'Exclusive Deals' },
                            { Icon: IconRocket, label: 'New Arrivals First' },
                        ].map(({ Icon, label }) => (
                            <div key={label} className='flex items-center gap-2 text-gray-400 text-xs font-semibold'>
                                <Icon className='w-4 h-4 text-violet-400/90' />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    {!submitted ? (
                        <form
                            onSubmit={onSubmitHandler}
                            className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
                        >
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email address'
                                required
                                className='flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm font-medium px-5 py-3.5 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all'
                            />
                            <button
                                type='submit'
                                disabled={loading}
                                className='shrink-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] px-8 py-3.5 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95 transition-all text-center min-w-[140px] disabled:opacity-50'
                            >
                                {loading ? 'Subscribing...' : (branding?.newsletterButtonText || 'Subscribe')}
                            </button>
                        </form>
                    ) : (
                        <div className='flex items-center justify-center gap-3 text-violet-400 font-bold text-sm'>
                            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                            </svg>
                            You're officially part of the {branding?.newsletterTitle || 'Elite Club'}!
                        </div>
                    )}

                    {/* Privacy note */}
                    <p className='text-[10px] text-gray-600 mt-5 font-medium tracking-wide'>
                        No spam, ever. Unsubscribe anytime. We respect your privacy.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default NewsletterBox