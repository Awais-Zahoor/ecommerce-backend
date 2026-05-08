import Subscriber from '../models/subscriberModel.js';
import { sendWelcomeEmail, sendCampaignEmail } from '../services/emailService.js';
import { generateCoupon } from '../utils/couponGenerator.js';
import validator from 'validator';

// ─── PUBLIC: POST /api/subscribe ─────────────────────────────────────────────
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validate email
        if (!email || !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please provide a valid email address.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 2. Check for duplicate
        const existing = await Subscriber.findOne({ email: normalizedEmail });
        if (existing) {
            if (!existing.isActive) {
                // Re-activate soft-deleted subscriber
                existing.isActive = true;
                await existing.save();
                return res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
            }
            return res.json({ success: false, message: 'This email is already subscribed to the Elite Club.' });
        }

        // 3. Generate coupon
        const couponCode = generateCoupon('ELITE');

        // 4. Save subscriber
        const subscriber = new Subscriber({
            email: normalizedEmail,
            couponCode,
            tags: ['elite-member', 'new-user'],
            source: 'elite-club',
        });
        await subscriber.save();

        // 5. Send welcome email (non-blocking — don't fail subscription if email fails)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            sendWelcomeEmail(normalizedEmail, couponCode).catch((err) =>
                console.error('[Email] Welcome email failed:', err.message)
            );
        }

        return res.json({
            success: true,
            message: 'Welcome to the Elite Club! Check your email for your exclusive coupon.',
            coupon: couponCode,
        });
    } catch (error) {
        console.error('[Subscribe]', error);
        res.json({ success: false, message: 'Subscription failed. Please try again.' });
    }
};

// ─── ADMIN: GET /api/admin/subscribers ───────────────────────────────────────
export const getSubscribers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const search = req.query.search?.trim() || '';
        const filter = req.query.filter || 'all'; // all | active | inactive

        // Build query
        const query = {};
        if (search) query.email = { $regex: search, $options: 'i' };
        if (filter === 'active') query.isActive = true;
        if (filter === 'inactive') query.isActive = false;

        const [subscribers, total] = await Promise.all([
            Subscriber.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-emailHistory'), // exclude heavy field from list
            Subscriber.countDocuments(query),
        ]);

        return res.json({
            success: true,
            subscribers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
                limit,
            },
        });
    } catch (error) {
        console.error('[GetSubscribers]', error);
        res.json({ success: false, message: 'Failed to fetch subscribers.' });
    }
};

// ─── ADMIN: DELETE /api/admin/subscriber/:id (soft delete) ───────────────────
export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriber = await Subscriber.findById(id);
        if (!subscriber) {
            return res.json({ success: false, message: 'Subscriber not found.' });
        }

        subscriber.isActive = false;
        await subscriber.save();

        return res.json({ success: true, message: 'Subscriber deactivated successfully.' });
    } catch (error) {
        console.error('[DeleteSubscriber]', error);
        res.json({ success: false, message: 'Failed to remove subscriber.' });
    }
};

// ─── ADMIN: POST /api/admin/subscriber/restore/:id ───────────────────────────
export const restoreSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        await Subscriber.findByIdAndUpdate(id, { isActive: true });
        return res.json({ success: true, message: 'Subscriber restored successfully.' });
    } catch (error) {
        console.error('[RestoreSubscriber]', error);
        res.json({ success: false, message: 'Failed to restore subscriber.' });
    }
};

// ─── ADMIN: POST /api/admin/send-campaign ────────────────────────────────────
export const sendCampaign = async (req, res) => {
    try {
        const { subject, htmlContent, testEmail } = req.body;

        if (!subject || !htmlContent) {
            return res.json({ success: false, message: 'Subject and content are required.' });
        }

        // Test mode: send to single email only
        if (testEmail) {
            await sendCampaignEmail([testEmail], `[TEST] ${subject}`, htmlContent);
            return res.json({ success: true, message: `Test email sent to ${testEmail}` });
        }

        // Get all active subscribers
        const subscribers = await Subscriber.find({ isActive: true }).select('email');
        if (subscribers.length === 0) {
            return res.json({ success: false, message: 'No active subscribers found.' });
        }

        const emails = subscribers.map((s) => s.email);
        const result = await sendCampaignEmail(emails, subject, htmlContent);

        // Log campaign in DB (store in each subscriber's history)
        await Subscriber.updateMany(
            { email: { $in: emails }, isActive: true },
            { $push: { emailHistory: { subject, sentAt: new Date() } } }
        );

        return res.json({
            success: true,
            message: `Campaign sent! ${result.sent}/${emails.length} emails delivered.`,
            result,
        });
    } catch (error) {
        console.error('[SendCampaign]', error);
        res.json({ success: false, message: 'Campaign failed. Please try again.' });
    }
};

// ─── ADMIN: GET /api/admin/subscribers/stats ─────────────────────────────────
export const getStats = async (req, res) => {
    try {
        const [total, active, thisMonth] = await Promise.all([
            Subscriber.countDocuments(),
            Subscriber.countDocuments({ isActive: true }),
            Subscriber.countDocuments({
                createdAt: { $gte: new Date(new Date().setDate(1)) }, // first of this month
            }),
        ]);

        return res.json({ success: true, stats: { total, active, inactive: total - active, thisMonth } });
    } catch (error) {
        console.error('[GetStats]', error);
        res.json({ success: false, message: 'Failed to fetch stats.' });
    }
};
