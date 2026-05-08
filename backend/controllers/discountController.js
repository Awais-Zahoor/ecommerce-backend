import discountModel from "../models/discountModel.js";

// ─── ADMIN: Create Discount ────────────────────────────────────────────────────
const createDiscount = async (req, res) => {
    try {
        const {
            code, name, description, type, value,
            bogoConfig, categoryTarget,
            startsAt, expiresAt,
            minCartValue, maxUses, perUserLimit,
            isActive
        } = req.body;

        if (!name || !type) {
            return res.json({ success: false, message: "Name and type are required." });
        }

        const requiresCode = ['percentage', 'fixed'].includes(type);
        if (requiresCode && !code) {
            return res.json({ success: false, message: "Coupon code is required for this discount type." });
        }

        if (type === 'bogo') {
            const cat = (categoryTarget || '').toString().trim();
            if (!cat) {
                return res.json({ success: false, message: "BOGO deals require a target category (no coupon code)." });
            }
        }

        if (startsAt && expiresAt && new Date(startsAt) >= new Date(expiresAt)) {
            return res.json({ success: false, message: "Start date/time must be before end date/time." });
        }

        const discountData = {
            name,
            description: description || '',
            type,
            value: Number(value) || 0,
            minCartValue:  Number(minCartValue) || 0,
            maxUses:       Number(maxUses) || 0,
            perUserLimit:  Number(perUserLimit) || 0,
            isActive:      isActive !== undefined ? isActive : true,
            startsAt:      startsAt  || null,
            expiresAt:     expiresAt || null,
        };

        if (requiresCode) discountData.code = code.toString().toUpperCase().trim();

        if (type === 'bogo' && bogoConfig) {
            discountData.bogoConfig = {
                buyQty:      Number(bogoConfig.buyQty) || 1,
                getQty:      Number(bogoConfig.getQty) || 1,
                getDiscount: Number(bogoConfig.getDiscount) || 100
            };
        }

        if (type === 'auto_category' || type === 'bogo') {
            discountData.categoryTarget = (categoryTarget || '').toString().trim();
        }

        const discount = new discountModel(discountData);
        await discount.save();

        res.json({ success: true, message: "Discount created successfully!", discount });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.json({ success: false, message: "This coupon code already exists." });
        }
        res.json({ success: false, message: error.message });
    }
};

// ─── ADMIN: List All Discounts ────────────────────────────────────────────────
const listDiscounts = async (req, res) => {
    try {
        // Exclude usageHistory from list response (can be large)
        const discounts = await discountModel.find({}).select('-usageHistory').sort({ createdAt: -1 });
        const now = new Date();
        // Annotate status
        const enriched = discounts.map(d => {
            const obj = d.toObject();
            const notStarted = d.startsAt && now < new Date(d.startsAt);
            const expired    = d.expiresAt && now > new Date(d.expiresAt);
            obj.scheduleStatus = notStarted ? 'scheduled' : expired ? 'expired' : d.isActive ? 'active' : 'inactive';
            return obj;
        });
        res.json({ success: true, discounts: enriched });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── ADMIN: Update Discount ───────────────────────────────────────────────────
const updateDiscount = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        if (!id) return res.json({ success: false, message: "Discount ID required." });

        if (updateData.value !== undefined)        updateData.value = Number(updateData.value);
        if (updateData.minCartValue !== undefined)  updateData.minCartValue = Number(updateData.minCartValue);
        if (updateData.maxUses !== undefined)       updateData.maxUses = Number(updateData.maxUses);
        if (updateData.perUserLimit !== undefined)  updateData.perUserLimit = Number(updateData.perUserLimit);
        if (updateData.code)                        updateData.code = updateData.code.toUpperCase().trim();
        if (updateData.type === 'bogo') {
            updateData.code = null;
            if (!(updateData.categoryTarget || '').toString().trim()) {
                return res.json({ success: false, message: "BOGO deals require a target category." });
            }
        }
        if (updateData.startsAt === '')             updateData.startsAt = null;
        if (updateData.expiresAt === '')            updateData.expiresAt = null;

        const nextStart = updateData.startsAt ? new Date(updateData.startsAt) : null;
        const nextEnd = updateData.expiresAt ? new Date(updateData.expiresAt) : null;
        if (nextStart && nextEnd && nextStart >= nextEnd) {
            return res.json({ success: false, message: "Start date/time must be before end date/time." });
        }

        await discountModel.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "Discount updated successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── ADMIN: Delete Discount ───────────────────────────────────────────────────
const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "Discount ID required." });
        await discountModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Discount deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── ADMIN: Toggle Active Status ─────────────────────────────────────────────
const toggleDiscount = async (req, res) => {
    try {
        const { id } = req.body;
        const discount = await discountModel.findById(id);
        if (!discount) return res.json({ success: false, message: "Discount not found." });
        discount.isActive = !discount.isActive;
        await discount.save();
        res.json({
            success: true,
            message: `Discount ${discount.isActive ? 'activated' : 'deactivated'}.`,
            isActive: discount.isActive
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── PUBLIC: Apply Coupon Code ────────────────────────────────────────────────
const validateDiscount = async (req, res) => {
    try {
        const { code, couponCode, cartAmount, cartTotal, cartItems, userId } = req.body;
        const enteredCode = (couponCode || code || '').toString().toUpperCase().trim();
        const currentCartAmount = Number(cartAmount ?? cartTotal ?? 0);

        if (!enteredCode) return res.json({ success: false, message: "Please enter a coupon code." });

        const discount = await discountModel.findOne({
            code: enteredCode,
            isActive: true
        });

        if (!discount) {
            return res.json({ success: false, message: "Invalid or inactive coupon code." });
        }

        const now = new Date();

        // ── Scheduling: not started yet ────────────────────────────────────────
        if (discount.startsAt && now < new Date(discount.startsAt)) {
            const startStr = new Date(discount.startsAt).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
            return res.json({ success: false, message: `This coupon goes live on ${startStr}.` });
        }

        // ── Scheduling: expired ────────────────────────────────────────────────
        if (discount.expiresAt && now > new Date(discount.expiresAt)) {
            return res.json({ success: false, message: "This coupon has expired." });
        }

        // ── Total usage limit ──────────────────────────────────────────────────
        if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
            return res.json({ success: false, message: "This coupon has reached its total usage limit." });
        }

        // ── Per-user usage limit ───────────────────────────────────────────────
        if (discount.perUserLimit > 0 && userId) {
            const userEntry = discount.usageHistory.find(h => h.userId === userId.toString());
            const userCount = userEntry ? userEntry.count : 0;
            if (userCount >= discount.perUserLimit) {
                return res.json({
                    success: false,
                    message: `You've already used this coupon ${userCount} time(s). Max allowed: ${discount.perUserLimit}.`
                });
            }
        }

        // ── Minimum cart value ─────────────────────────────────────────────────
        if (currentCartAmount < discount.minCartValue) {
            return res.json({
                success: false,
                message: `Minimum cart value of Rs. ${discount.minCartValue.toLocaleString()} required.`
            });
        }

        // ── Auto discounts cannot be manually applied ──────────────────────────
        if (['auto_category', 'free_shipping', 'bogo'].includes(discount.type)) {
            return res.json({ success: false, message: "This discount is applied automatically (no coupon code)." });
        }

        // ── Calculate discount amount ──────────────────────────────────────────
        let discountAmount = 0;

        if (discount.type === 'percentage') {
            discountAmount = Math.round(currentCartAmount * (discount.value / 100));
        }
        else if (discount.type === 'fixed') {
            discountAmount = Math.min(discount.value, currentCartAmount);
        }

        const discountedTotal = Math.max(currentCartAmount - discountAmount, 0);

        res.json({
            success: true,
            message: `✅ Coupon "${discount.code}" applied! You save Rs. ${discountAmount.toLocaleString()}.`,
            discount: {
                _id: discount._id,
                code: discount.code,
                name: discount.name,
                type: discount.type,
                value: discount.value,
                discountAmount,
                discountedTotal
            },
            pricing: {
                cartTotal: currentCartAmount,
                discountAmount,
                discountedTotal
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const applyDiscount = validateDiscount;

// ─── PUBLIC: Get Automatic Discounts ─────────────────────────────────────────
const getAutoDiscounts = async (req, res) => {
    try {
        const now = new Date();
        const autoDiscounts = await discountModel.find({
            type:     { $in: ['free_shipping', 'auto_category', 'bogo'] },
            isActive: true,
            $or: [
                { startsAt:  null },
                { startsAt:  { $lte: now } }
            ]
        }).select('-usageHistory');

        // Filter out expired ones
        const live = autoDiscounts.filter(d => !d.expiresAt || now <= new Date(d.expiresAt));
        res.json({ success: true, autoDiscounts: live });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── INTERNAL: Increment usage after order placed ─────────────────────────────
const incrementUsage = async (discountId, userId) => {
    try {
        if (!discountId) return;
        const discount = await discountModel.findById(discountId);
        if (!discount) return;

        // Increment global count
        discount.usedCount += 1;

        // Increment per-user count
        if (userId) {
            const entry = discount.usageHistory.find(h => h.userId === userId.toString());
            if (entry) {
                entry.count += 1;
            } else {
                discount.usageHistory.push({ userId: userId.toString(), count: 1 });
            }
        }

        await discount.save();
    } catch (error) {
        console.log('Usage increment error:', error);
    }
};

/** One or more Mongo IDs comma-separated (e.g. coupon + BOGO). */
const incrementDiscountUsages = async (discountId, userId) => {
    if (!discountId || !userId) return;
    const ids = String(discountId).split(',').map((s) => s.trim()).filter(Boolean);
    for (const id of ids) {
        await incrementUsage(id, userId);
    }
};

/** Standard delivery when no free-shipping promotion applies (must match frontend `delivery_fee`). */
export const STANDARD_DELIVERY_FEE_PKR = 500;

/**
 * Shipping is free only when an active `free_shipping` discount rule qualifies for this subtotal.
 * No hardcoded cart thresholds elsewhere.
 */
export const computeDeliveryFeeForSubtotal = async (cartSubtotal) => {
    const subtotal = Number(cartSubtotal) || 0;
    const now = new Date();
    const rules = await discountModel.find({
        type: 'free_shipping',
        isActive: true,
        $or: [{ startsAt: null }, { startsAt: { $lte: now } }]
    }).lean();

    for (const r of rules) {
        if (r.expiresAt && now > new Date(r.expiresAt)) continue;
        if (subtotal >= Number(r.minCartValue || 0)) {
            return 0;
        }
    }
    return STANDARD_DELIVERY_FEE_PKR;
};

export {
    createDiscount,
    listDiscounts,
    updateDiscount,
    deleteDiscount,
    toggleDiscount,
    validateDiscount,
    applyDiscount,
    getAutoDiscounts,
    incrementUsage,
    incrementDiscountUsages
};
