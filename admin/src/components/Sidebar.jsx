import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    return (
        <div className='w-56 lg:w-64 h-full border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col transition-all duration-300'>
            <div className='flex-1 overflow-y-auto no-scrollbar py-8 px-4'>
                <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 mb-6'>Management</p>
                
                <div className='space-y-1.5'>
                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.DashboardIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Dashboard</span>
                            </>
                        )}
                    </NavLink>
                    
                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/add"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.AddIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Add Product</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/list"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.ListIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Catalog</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/orders"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.OrderIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Orders</span>
                            </>
                        )}
                    </NavLink>
                </div>

                <div className='my-8 border-t border-gray-50 dark:border-gray-900 mx-4'></div>
                <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 mb-6'>Eyewear Module</p>

                <div className='space-y-1.5'>
                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/add-sunglasses"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.AddIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Add Eyewear</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/list-sunglasses"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.ListIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Eyewear List</span>
                            </>
                        )}
                    </NavLink>
                </div>

                <div className='my-8 border-t border-gray-50 dark:border-gray-900 mx-4'></div>
                <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 mb-6'>Configuration</p>

                <div className='space-y-0 border border-gray-100 dark:border-gray-800 rounded-none overflow-hidden shadow-sm'>
                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/branding"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.BrandingIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Branding</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/promotions"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.MarketingIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Promotions</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none border-b border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/subscribers"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.EliteClubIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Elite Club</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-none transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300'}`} 
                        to="/inquiries"
                    >
                        {({ isActive }) => (
                            <>
                                {!isActive && <div className='absolute left-0 top-0 w-1.5 h-full bg-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[2px_0_10px_rgba(67,56,202,0.3)]' />}
                                <assets.InquiryIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className='font-black text-xs uppercase tracking-widest'>Inquiries</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </div>
            
            <div className='p-6 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs'>AD</div>
                    <div>
                        <p className='text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight'>Administrator</p>
                        <p className='text-[10px] text-gray-400 font-bold'>System Root</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
