import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import FreeShippingBar from './FreeShippingBar';
import { IconHeart } from './icons/StoreIcons';
import { toast } from 'react-toastify';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { 
        setShowSearch, showSearch, getCartCount, navigate, token, setToken, setCartItems, 
        wishlist, isDarkMode, toggleTheme, branding 
    } = useContext(ShopContext);

    const showSearchIcon = true;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        toast.success("Logged out successfully");
    }

    return (
        <>
            <FreeShippingBar minimal={true} />
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3 shadow-sm' : isDarkMode ? 'bg-gray-950/40 py-6' : 'bg-transparent py-6'} px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]`}>
                <div className='flex items-center justify-between font-medium max-w-7xl mx-auto'>

                    {/* Branding / Logo */}
                    <Link to='/' className='transition-all duration-300 hover:scale-105 active:scale-95 flex items-center shrink-0 group'>
                        {branding.logo && (
                            <img src={branding.logo} className='w-auto h-7 sm:h-9 md:h-11 object-contain logo-no-dark-change' alt="Logo" />
                        )}
                    </Link>

                    {/* Navigation Links - Centered */}
                    <ul className='hidden lg:flex items-center gap-10'>
                        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
                            <NavLink 
                                key={item} 
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                                className={({isActive}) => `nav-link text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white'}`}
                            >
                                {item}
                            </NavLink>
                        ))}
                    </ul>

                    {/* Interaction Icons */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                        
                        {/* Theme Toggle */}
                        <div className='p-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-90 group' onClick={toggleTheme}>
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            )}
                        </div>

                        <div className='w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block' />

                        {showSearchIcon && (
                            <div className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-90 group' onClick={() => setShowSearch(!showSearch)}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-indigo-600 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        )}

                        <div className='group relative'>
                            <div className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-90 group' onClick={() => token ? null : navigate('/login')}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-indigo-600 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            {/* Dropdown Menu */}
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                <div className='flex flex-col gap-2 w-48 py-3 px-5 bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-lg'>
                                    {token ? (
                                        <>
                                            <p className='text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1'>Account Portal</p>
                                            <NavLink to='/collection' className='flex flex-col items-center gap-1 group'>
                                                <p className='text-[11px] font-black tracking-[0.2em] uppercase group-hover:text-black dark:group-hover:text-white transition-colors'>Archive</p>
                                                <hr className='w-0 group-hover:w-full border-none h-[2px] bg-black dark:bg-white transition-all duration-300' />
                                            </NavLink>

                                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black dark:hover:text-white transition-colors py-1'>Orders</p>
                                            <div className='h-px bg-gray-100 dark:bg-gray-800 my-1' />
                                            <p onClick={logout} className='cursor-pointer hover:text-red-500 transition-colors py-1'>Logout</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className='text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1'>Account Portal</p>
                                            <p onClick={() => navigate('/login')} className='cursor-pointer hover:text-black dark:hover:text-white transition-colors py-1'>Login</p>
                                            <p onClick={() => navigate('/login')} className='cursor-pointer hover:text-black dark:hover:text-white transition-colors py-1'>Sign Up</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Wishlist Icon */}
                        <Link to='/wishlist' className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hover:scale-110 active:scale-90 group hidden sm:block'>
                            <IconHeart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
                            {wishlist.length > 0 && (
                                <p className='absolute right-1 top-1 w-4 h-4 text-center flex items-center justify-center bg-red-500 text-white rounded-full text-[8px] font-bold animate-bounce'>
                                    {wishlist.length}
                                </p>
                            )}
                        </Link>

                        <Link to='/cart' className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hover:scale-110 active:scale-90 group'>
                            <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-indigo-600 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className='absolute right-1 top-1 w-4 h-4 text-center flex items-center justify-center bg-black dark:bg-white dark:text-black text-white rounded-full text-[8px] font-bold'>
                                {getCartCount()}
                            </p>
                        </Link>

                        <div className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-90 group' onClick={() => setVisible(true)}>
                            <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-indigo-600 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile side menu */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white dark:bg-gray-950 z-[60] transition-all duration-500 ease-in-out shadow-2xl flex flex-col ${visible ? 'w-[300px]' : 'w-0'}`}>
                
                {/* 1. Header with Branding */}
                <div className='flex items-center justify-between p-6 border-b dark:border-gray-900 bg-gray-50/50 dark:bg-white/[0.02]'>
                    <div className='max-w-[100px]'>
                        {branding.logo && (
                            <img src={branding.logo} className='w-full h-6 object-contain logo-no-dark-change' alt="Logo" />
                        )}
                    </div>
                    <div 
                        onClick={() => setVisible(false)} 
                        className='p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full cursor-pointer transition-all active:scale-90 group'
                    >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* 2. Account Status (Contextual) */}
                <div className='px-6 py-6 border-b dark:border-gray-900 bg-white dark:bg-gray-950'>
                    {token ? (
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg'>
                                {token ? 'A' : 'U'}
                            </div>
                            <div>
                                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1'>Welcome Back</p>
                                <p className='text-sm font-black dark:text-white uppercase tracking-tight leading-none'>Account Portal</p>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => {navigate('/login'); setVisible(false)}} className='flex items-center gap-4 cursor-pointer group'>
                            <div className='w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all'>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1'>Account Portal</p>
                                <p className='text-sm font-black dark:text-white uppercase tracking-tight group-hover:text-indigo-500 transition-colors'>SIGN IN / REGISTER</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Main Navigation links */}
                <div className='flex flex-col flex-1 overflow-y-auto no-scrollbar py-4 bg-white dark:bg-gray-950 px-2'>
                    <NavLink onClick={() => setVisible(false)} className='group relative py-4 px-6 rounded-2xl overflow-hidden flex items-center gap-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/5 mb-1' to='/'>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <p className='font-black uppercase tracking-[0.2em] text-[11px] dark:text-gray-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300'>HOME</p>
                    </NavLink>
                    
                    <NavLink onClick={() => setVisible(false)} className='group relative py-4 px-6 rounded-2xl overflow-hidden flex items-center gap-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/5 mb-1' to='/collection'>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className='font-black uppercase tracking-[0.2em] text-[11px] dark:text-gray-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300'>COLLECTION</p>
                    </NavLink>
                    {token && (
                        <NavLink onClick={() => setVisible(false)} className='group relative py-4 px-6 rounded-2xl overflow-hidden flex items-center gap-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/5 mb-1' to='/orders'>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <p className='font-black uppercase tracking-[0.2em] text-[11px] dark:text-gray-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300'>MY ORDERS</p>
                        </NavLink>
                    )}

                    <div className='h-px bg-gray-100 dark:bg-gray-900 my-4 mx-6' />

                    <NavLink onClick={() => setVisible(false)} className='group relative py-4 px-6 rounded-2xl overflow-hidden flex items-center gap-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/5 mb-1' to='/about'>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className='font-black uppercase tracking-[0.2em] text-[11px] dark:text-gray-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300'>ABOUT</p>
                    </NavLink>

                    <NavLink onClick={() => setVisible(false)} className='group relative py-4 px-6 rounded-2xl overflow-hidden flex items-center gap-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/5 mb-1' to='/contact'>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className='font-black uppercase tracking-[0.2em] text-[11px] dark:text-gray-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300'>CONTACT</p>
                    </NavLink>

                    {token && (
                        <div onClick={() => {logout(); setVisible(false)}} className='group relative py-6 px-6 overflow-hidden flex items-center gap-4 cursor-pointer mt-4 rounded-2xl bg-red-50/50 dark:bg-red-500/5'>
                            <svg className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <p className='font-black uppercase tracking-[0.2em] text-[11px] text-red-400 group-hover:text-red-500 transition-all'>LOGOUT ACCOUNT</p>
                        </div>
                    )}
                </div>

                {/* 4. Drawer Footer */}
                <div className='p-6 border-t dark:border-gray-900 bg-gray-50/50 dark:bg-white/[0.02] mt-auto'>
                    <div className='flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400'>
                        <p>© 2024 AWAIS MART</p>
                        <p>v.ALPHA</p>
                    </div>
                </div>
            </div>
            
            {/* Mobile Drawer Overlay */}
            {visible && <div onClick={() => setVisible(false)} className='fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm sm:hidden transition-opacity duration-300' />}
        </>
    )
}

export default Navbar