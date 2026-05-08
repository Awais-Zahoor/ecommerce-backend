import mongoose from 'mongoose';

/**
 * Subscriber Model — Elite Club Email Subscription System
 * Production-ready schema with coupon, tags, soft-delete support
 */
const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        isActive: {
            type: Boolean,
            default: true, // soft-delete: set false instead of deleting
        },
        tags: {
            type: [String],
            default: ['elite-member', 'new-user'],
        },
        source: {
            type: String,
            default: 'elite-club',
            enum: ['elite-club', 'checkout', 'popup', 'admin'],
        },
        // Discount coupon generated on subscription
        couponCode: {
            type: String,
            default: null,
        },
        couponUsed: {
            type: Boolean,
            default: false,
        },
        // Track campaign emails: [{ subject, sentAt }]
        emailHistory: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt automatically
    }
);

// Index for fast lookup
subscriberSchema.index({ isActive: 1 });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
