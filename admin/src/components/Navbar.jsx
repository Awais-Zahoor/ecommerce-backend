import React from 'react'
import { assets } from '../assets/assets';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = ({setToken, isDarkMode, setIsDarkMode, logo, setShowSidebar}) => {

  const toggleDark = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('adminDarkMode', next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className='flex items-center py-3 px-6 lg:px-10 justify-between bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors'>
      {/* Left: Logo + Badge */}
      <div className='flex items-center gap-4'>
        {/* Mobile menu toggle */}
        <button
          onClick={() => setShowSidebar(prev => !prev)}
          className='lg:hidden p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 focus:outline-none transition-colors mr-1'
          title="Toggle Navigation Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <img
          src={logo || assets.logo}
          className="h-9 w-auto object-contain logo-no-dark-change"
          alt="Awais Mart"
        />
        <div className='hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800'>
          <span className='w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse'></span>
          <span className='text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em]'>Admin Panel</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className='flex items-center gap-4'>

        {/* Dark Mode Toggle — Premium pill style */}
        <button
          onClick={toggleDark}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className='relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-300 select-none group
            bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 
            hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400
            active:scale-95'
        >
          <span className='transition-transform duration-500 group-hover:rotate-180'>
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </span>
          <span className='hidden lg:inline'>
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Divider */}
        <div className='hidden sm:block h-6 w-px bg-gray-100 dark:bg-gray-800'></div>

        {/* Logout */}
        <button
          onClick={() => setToken('')}
          className='flex items-center gap-2 bg-gray-950 dark:bg-white text-white dark:text-gray-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className='hidden sm:inline'>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
