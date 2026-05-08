import React, { useContext, Suspense } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, Stage } from '@react-three/drei'

// Lightweight 3D model preview for cards
const ModelPreview = ({ modelUrl }) => {
    const { backendUrl } = useContext(ShopContext);
    const fullUrl = modelUrl ? `${backendUrl}/models/${modelUrl}` : null;
    const { scene } = useGLTF(fullUrl || 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/glasses/model.gltf');
    
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <primitive object={scene} scale={1.5} />
        </Float>
    );
};

const SunglassesCard = ({ id, model3D, name, price, brand, bestseller }) => {
    const { currency, addToCart } = useContext(ShopContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(id, 'default');
    };

    return (
        <Link 
            to={`/sunglasses/${id}`} 
            className='group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full'
        >
            <div className='relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-800/50 cursor-pointer'>
                <div className='w-full h-full'>
                    <Suspense fallback={
                        <div className='w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse'>
                             <span className='text-[8px] font-black uppercase tracking-widest text-gray-400'>Loading 3D Engine...</span>
                        </div>
                    }>
                        <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
                            <Stage environment="city" intensity={0.5}>
                                <ModelPreview modelUrl={model3D} />
                            </Stage>
                        </Canvas>
                    </Suspense>
                </div>
                
                {bestseller && (
                    <div className='absolute top-6 left-6'>
                        <span className='px-4 py-1.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg'>
                            Bestseller
                        </span>
                    </div>
                )}

                <div className='absolute top-6 right-6'>
                    <div className='w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-indigo-600 shadow-sm'>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        </svg>
                    </div>
                </div>

                {/* Quick Actions Overlay */}
                <div className='absolute bottom-6 left-6 right-6 flex gap-2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500'>
                    <button 
                        onClick={handleAddToCart}
                        className='flex-1 py-3 bg-black dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all'
                    >
                        Add to Bag
                    </button>
                    <div className='w-11 h-11 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl flex items-center justify-center shadow-xl hover:text-indigo-600 transition-all'>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className='p-8 space-y-4 flex-1 flex flex-col'>
                <div className='flex justify-between items-start gap-4'>
                    <div className='flex-1'>
                        <p className='text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1'>{brand}</p>
                        <h3 className='text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors'>{name}</h3>
                    </div>
                    <p className='text-sm font-black text-indigo-600 whitespace-nowrap'>{currency}{price.toLocaleString()}</p>
                </div>
                
                <div className='pt-4 flex items-center justify-between mt-auto'>
                    <span className='text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2'>
                        <span className='w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse'></span>
                        3D Engine Active
                    </span>
                    <div className='w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all'>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SunglassesCard
