import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        uppercase: true,
        trim: true,
        unique: true,
        sparse: true // allows null for auto discounts (no code needed)
    },
    name:        { type: String, required: true }, // e.g., "EID2024 Special"
    description: { type: String, default: '' },    // optional short description for admin
    type: {
        type: String,
        enum: ['percentage', 'fixed', 'bogo', 'free_shipping', 'auto_category'],
        required: true
    },
    value: { type: Number, default: 0 },
    bogoConfig: {
        buyQty:      { type: Number, default: 1 },
        getQty:      { type: Number, default: 1 },
        getDiscount: { type: Number, default: 100 } // 100 = free, 50 = half price
    },
    categoryTarget: { type: String, default: '' },

    // ── Scheduling ───────────────────────────────────────────────────────────
    startsAt:  { type: Date, default: null }, // offer goes live at this date/time
    expiresAt: { type: Date, default: null }, // offer ends at this date/time

    // ── Usage Controls ───────────────────────────────────────────────────────
    minCartValue:  { type: Number, default: 0 },  // min subtotal to activate
    maxUses:       { type: Number, default: 0 },  // 0 = unlimited (total)
    perUserLimit:  { type: Number, default: 0 },  // 0 = unlimited per user
    usedCount:     { type: Number, default: 0 },  // global total uses
    usageHistory:  [{ // per-user usage tracking
        userId: { type: String },
        count:  { type: Number, default: 1 }
    }],

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

const discountModel = mongoose.models.discount || mongoose.model('discount', discountSchema);

export default discountModel;
