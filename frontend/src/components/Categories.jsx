import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const Categories = () => {
    const { branding } = useContext(ShopContext);

    const categories = [
        {
            name: 'Men',
            title: 'MEN\'S COLLECTION',
            image: branding?.categoryMen || assets.category_men || assets.p_img1,
            link: '/collection?category=Men',
            description: 'Elegance meets functionality. Discover our latest arrivals for the modern gentleman.',
            bgColor: 'bg-indigo-50/30'
        },
        {
            name: 'Women',
            title: 'WOMEN\'S COLLECTION',
            image: branding?.categoryWomen || assets.category_women || assets.p_img2,
            link: '/collection?category=Women',
            description: 'Empowering style. Explore contemporary pieces designed for timeless sophistication.',
            bgColor: 'bg-rose-50/20'
        },
        {
            name: 'Kids',
            title: 'KIDS\' COLLECTION',
            image: branding?.categoryKids || assets.category_kids || assets.p_img3,
            link: '/collection?category=Kids',
            description: 'Playful and premium. Durable fashion for the next generation of style icons.',
            bgColor: 'bg-amber-50/20'
        }
    ];

    return (
        <div className='my-28'>
            <div className='text-center mb-16 px-4'>
                <Title text1={'SHOP BY'} text2={'CATEGORIES'} />
                <p className='w-full max-w-2xl m-auto text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-3 font-medium uppercase tracking-[0.2em]'>
                    Distinct Collections • Curated for Excellence
                </p>
            </div>

            <div className='flex flex-col gap-24 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                {categories.map((item, index) => (
                    <div 
                        key={index} 
                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-20 group`}
                    >
                        {/* Image Section */}
                        <div className='w-full lg:w-3/5 relative overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[16/9] lg:aspect-auto lg:h-[500px]'>
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500'></div>
                            
                            {/* Accent Badge */}
                            <div className='absolute top-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg'>
                                <p className='text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]'>Luxury Series</p>
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className='w-full lg:w-2/5 space-y-6 text-center lg:text-left'>
                            <div className='space-y-2'>
                                <p className='text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2'>Department {index + 1}</p>
                                <h2 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight'>
                                    {item.title}
                                </h2>
                            </div>
                            
                            <p className='text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed font-medium'>
                                {item.description}
                            </p>

                            <Link to={item.link}>
                                <button className='mt-4 group/btn relative px-10 py-4 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95'>
                                    <span className='relative z-10'>Shop {item.name}</span>
                                    <div className='absolute inset-0 bg-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300'></div>
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories
