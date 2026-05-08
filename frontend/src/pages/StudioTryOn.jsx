import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProfessionalTryOn from '../components/ProfessionalTryOn';

const StudioTryOn = () => {
    const { sunglasses, isDarkMode } = useContext(ShopContext);
    const [showLiveTryOn, setShowLiveTryOn] = useState(false);
    const [selectedSunglasses, setSelectedSunglasses] = useState(null);

    return (
        <div className={`min-h-screen pt-28 pb-20 px-4 sm:px-[5vw] transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <div className='max-w-7xl mx-auto'>
                
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6'>
                        <span className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse'></span>
                        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500'>Professional 3D Optics Lab</span>
                    </div>
                    <Title text1={'VIRTUAL'} text2={'STUDIO'} />
                    <p className='mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed uppercase tracking-widest'>
                        Experience next-generation 3D eyewear try-on powered by MediaPipe. 
                        Launch the live mirror to see how our premium frames fit your face in real-time.
                    </p>
                </div>

                <div className='flex flex-col items-center gap-12'>
                    <div className={`w-full max-w-4xl rounded-[3rem] p-12 border flex flex-col items-center text-center transition-all duration-700 ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-gray-50 border-black/5 shadow-2xl'}`}>
                        <div className='w-24 h-24 rounded-full bg-indigo-600/10 flex items-center justify-center mb-8'>
                            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className='text-2xl font-black uppercase tracking-tight mb-4'>Ready to see the future?</h3>
                        <p className='text-gray-400 text-sm font-bold uppercase tracking-widest max-w-md mb-10'>Our 3D engine will calibrate your facial mesh for precise optical alignment.</p>
                        
                        <button 
                            onClick={() => setShowLiveTryOn(true)}
                            className='px-16 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all'
                        >
                            Launch 3D Live Mirror →
                        </button>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl'>
                        {sunglasses.slice(0, 4).map((item) => (
                            <div key={item._id} className='group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'>
                                <img src={item.image[0]} className='w-full h-full object-contain p-6 transition-transform group-hover:scale-110' alt="" />
                                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                    <button 
                                        onClick={() => { setSelectedSunglasses(item); setShowLiveTryOn(true); }}
                                        className='bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest'
                                    >Try This</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showLiveTryOn && (
                    <ProfessionalTryOn 
                        selectedItem={selectedSunglasses || sunglasses[0]} 
                        onClose={() => setShowLiveTryOn(false)} 
                        sunglassesList={sunglasses}
                        isDarkMode={isDarkMode}
                        onSwitch={(item) => setSelectedSunglasses(item)}
                    />
                )}
            </div>
        </div>
    );
};

export default StudioTryOn;
