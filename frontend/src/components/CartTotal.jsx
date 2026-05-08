import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import FreeShippingBar from './FreeShippingBar';
import { IconCheckCircle, IconTag } from './icons/StoreIcons';

const CartTotal = () => {
    const {
        currency, delivery_fee, getCartAmount,
        appliedDiscount, autoDiscounts, cartItems, products,
        applyDiscountCode, removeCoupon,
        getDiscountAmount, getOrderDiscountSnapshot, isFreeShippingActive, getFinalTotal
    } = useContext(ShopContext);

    const [inputCode, setInputCode] = useState('');
    const [applying, setApplying] = useState(false);

    const amount = getCartAmount();
    const discountAmount = getDiscountAmount();
    const discSnap = getOrderDiscountSnapshot();
    const freeShipping = isFreeShippingActive();
    const activeDeliveryFee = freeShipping ? 0 : delivery_fee;
    
    const hasCategoryInCart = (targetCategory) => {
        if (!targetCategory) return false;
        return Object.keys(cartItems).some((itemId) => {
            const product = products.find((p) => p._id === itemId);
            return product && product.category?.toLowerCase() === targetCategory.toLowerCase();
        });
    };

    const isDiscountLive = (ad) => {
        const now = Date.now();
        if (ad.startsAt && now < new Date(ad.startsAt).getTime()) return false;
        if (ad.expiresAt && now > new Date(ad.expiresAt).getTime()) return false;
        return true;
    };

    const activeAutoDiscounts = autoDiscounts.filter(ad => {
        if (!ad.isActive || !isDiscountLive(ad)) return false;
        if (amount < (ad.minCartValue || 0)) return false;
        if (ad.type === 'free_shipping') return true;
        if (ad.type === 'auto_category' && hasCategoryInCart(ad.categoryTarget)) return true;
        if (ad.type === 'bogo' && hasCategoryInCart(ad.categoryTarget)) return true;
        return false;
    });

    const discountLabel = discSnap.discountCode
        ? `(${discSnap.discountCode})`
        : discSnap.bogoDiscount > 0
            ? '(BOGO)'
            : discSnap.autoCategoryDiscount > 0
                ? '(Category)'
                : '(Auto)';

    const handleApply = async () => {
        if (!inputCode.trim()) return;
        setApplying(true);
        const ok = await applyDiscountCode(inputCode.trim());
        if (ok) setInputCode('');
        setApplying(false);
    };

    return (
        <div className='w-full space-y-6'>
            <div className='flex items-center gap-3'>
                <span className='w-1 h-5 bg-indigo-600 rounded-full'></span>
                <h3 className='text-lg font-black dark:text-white uppercase tracking-[0.2em]'>Order Total</h3>
            </div>

            <FreeShippingBar />

            {/* Auto Discount Badges */}
            {activeAutoDiscounts.length > 0 && (
                <div className='space-y-2'>
                    {activeAutoDiscounts.map(ad => (
                        <div key={ad._id} className='flex items-center gap-3 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 px-4 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest'>
                            <IconCheckCircle className="w-4 h-4 shrink-0" />
                            <span>
                                {ad.type === 'free_shipping'
                                    ? `Free Shipping Active`
                                    : ad.type === 'bogo'
                                        ? `BOGO Active on ${ad.categoryTarget}`
                                        : `${ad.value}% Auto-Discount applied`}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Totals Card */}
            <div className='bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50 space-y-4'>
                <div className='flex justify-between items-center py-2'>
                    <p className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest'>Subtotal</p>
                    <p className='text-sm font-black dark:text-white'>{currency} {amount.toLocaleString()}.00</p>
                </div>

                {discountAmount > 0 && (
                    <div className='flex justify-between items-center py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50'>
                        <p className='text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest'>Discount {discountLabel}</p>
                        <p className='text-sm font-black text-emerald-700 dark:text-emerald-400'>− {currency} {discountAmount.toLocaleString()}.00</p>
                    </div>
                )}

                <div className='flex justify-between items-center py-2'>
                    <p className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest'>Shipping</p>
                    <p className={`text-sm font-black ${freeShipping ? 'text-emerald-600 dark:text-emerald-400' : 'dark:text-white'}`}>
                        {freeShipping ? 'FREE' : `${currency} ${activeDeliveryFee}.00`}
                    </p>
                </div>

                <div className='pt-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center'>
                    <p className='text-sm font-black dark:text-white uppercase tracking-[0.2em]'>Final Total</p>
                    <p className='text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter'>
                        {currency} {amount === 0 ? 0 : getFinalTotal().toLocaleString()}.00
                    </p>
                </div>
            </div>

            {/* Coupon Section */}
            <div className='pt-2'>
                {appliedDiscount ? (
                    <div className='flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl px-5 py-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm'>
                                <IconTag className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1'>{appliedDiscount.code}</p>
                                <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none'>{appliedDiscount.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={removeCoupon}
                            className='text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all'
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className='flex gap-2 p-1.5 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl'>
                        <input
                            type='text'
                            value={inputCode}
                            onChange={e => setInputCode(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && handleApply()}
                            placeholder='PROMO CODE'
                            className='flex-1 bg-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none dark:text-white placeholder:text-gray-400'
                        />
                        <button
                            onClick={handleApply}
                            disabled={applying || !inputCode.trim()}
                            className='bg-gray-950 dark:bg-white text-white dark:text-gray-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30'
                        >
                            {applying ? '...' : 'Apply'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartTotal