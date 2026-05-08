import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { IconCheckCircle, IconTruck } from './icons/StoreIcons';

const FreeShippingBar = ({ minimal = false }) => {
    const { currency, getCartAmount, autoDiscounts } = useContext(ShopContext);
    const amount = getCartAmount();

    const liveFreeShippingRule = useMemo(() => {
        const now = Date.now();
        return autoDiscounts.find((ad) => {
            if (ad.type !== 'free_shipping' || !ad.isActive) return false;
            if (ad.startsAt && now < new Date(ad.startsAt).getTime()) return false;
            if (ad.expiresAt && now > new Date(ad.expiresAt).getTime()) return false;
            return true;
        });
    }, [autoDiscounts]);

    if (!liveFreeShippingRule) return null;

    if (amount === 0 && minimal) return null;

    const threshold = Math.max(0, Number(liveFreeShippingRule.minCartValue) || 0);
    const progress =
        threshold <= 0 ? (amount > 0 ? 100 : 0) : Math.min((amount / threshold) * 100, 100);
    const remaining = threshold <= 0 ? 0 : Math.max(threshold - amount, 0);

    return (
        <div className={`w-full transition-all duration-500 ${minimal ? 'py-2 px-4 bg-indigo-600 text-white' : 'my-6 p-4 bg-slate-50 dark:bg-gray-950/50 rounded-2xl border border-slate-100 dark:border-gray-800'}`}>
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center mb-1.5 gap-2'>
                    <p className={`flex items-center gap-1.5 font-black uppercase tracking-[0.2em] ${minimal ? 'text-[8px] sm:text-[9px]' : 'text-[9px] sm:text-[10px] text-slate-400'}`}>
                        {progress >= 100 ? (
                            <>
                                <IconCheckCircle className={`w-3.5 h-3.5 shrink-0 ${minimal ? 'text-white' : 'text-emerald-500'}`} />
                                <span>Free shipping unlocked ({liveFreeShippingRule.name})</span>
                            </>
                        ) : (
                            <>
                                <IconTruck className={`w-3.5 h-3.5 shrink-0 ${minimal ? 'text-white/90' : 'text-slate-500'}`} />
                                <span>
                                    Add {currency}
                                    {remaining.toLocaleString()} more for free shipping — {liveFreeShippingRule.name}
                                </span>
                            </>
                        )}
                    </p>
                    <p className={`font-bold ${minimal ? 'text-[8px] sm:text-[9px]' : 'text-[10px] text-slate-500'}`}>{Math.round(progress)}%</p>
                </div>
                <div className={`h-1 w-full rounded-full overflow-hidden ${minimal ? 'bg-white/20' : 'bg-slate-200 dark:bg-gray-800'}`}>
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${minimal ? 'bg-white' : 'bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(56,249,215,0.3)]'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FreeShippingBar;
