/**
 * Coupon Generator Utility
 * Generates unique uppercase alphanumeric coupon codes
 */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a coupon code like: ELITE-X7K2-9M3Q
 */
export const generateCoupon = (prefix = 'ELITE') => {
    const segment = (len) =>
        Array.from({ length: len }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');

    return `${prefix}-${segment(4)}-${segment(4)}`;
};

export default generateCoupon;
