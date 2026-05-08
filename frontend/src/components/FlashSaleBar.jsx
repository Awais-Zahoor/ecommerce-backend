import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const getRemaining = (endsAt) => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (Number.isNaN(diff) || diff <= 0) return null;
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
};

const FlashSaleBar = () => {
    const { branding } = useContext(ShopContext);
    const [tick, setTick] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setTick(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const countdown = useMemo(() => {
        if (!branding?.flashSaleEndsAt) return null;
        return getRemaining(branding.flashSaleEndsAt);
    }, [branding?.flashSaleEndsAt, tick]);

    if (!branding?.flashSaleEnabled) return null;
    if (branding?.flashSaleEndsAt && !countdown) return null;

    const text = branding?.flashSaleText || 'Flash Sale Live Now!';
    const bgImage = branding?.flashSaleBanner;

    return (
        <div
            className='mb-4 rounded-xl border border-red-200 dark:border-red-800 px-4 py-3 text-white overflow-hidden relative'
            style={{
                background: bgImage
                    ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bgImage}) center/cover`
                    : 'linear-gradient(90deg, #dc2626, #f97316)'
            }}
        >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative z-10'>
                <p className='font-black tracking-wide uppercase text-sm'>{text}</p>
                {countdown && (
                    <p className='text-xs font-bold bg-black/20 rounded-lg px-3 py-1.5 w-fit'>
                        Ends in {String(countdown.hours).padStart(2, '0')}:
                        {String(countdown.minutes).padStart(2, '0')}:
                        {String(countdown.seconds).padStart(2, '0')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FlashSaleBar;
