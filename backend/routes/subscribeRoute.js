import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { subscribe, getSubscribers, deleteSubscriber, restoreSubscriber, sendCampaign, getStats } from '../controllers/subscribeController.js';
import adminAuth from '../middleware/adminAuth.js';

const subscribeRouter = express.Router();

/**
 * Rate Limiter for Public Subscribe API
 * Prevents spamming from a single IP (10 requests per hour)
 */
const subscribeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { success: false, message: 'Too many subscription attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────
subscribeRouter.post('/subscribe', subscribeLimiter, subscribe);

// ─── ADMIN ROUTES (Protected by adminAuth) ───────────────────────────────────
subscribeRouter.get('/admin/list', adminAuth, getSubscribers);
subscribeRouter.get('/admin/stats', adminAuth, getStats);
subscribeRouter.post('/admin/delete/:id', adminAuth, deleteSubscriber);
subscribeRouter.post('/admin/restore/:id', adminAuth, restoreSubscriber);
subscribeRouter.post('/admin/send-campaign', adminAuth, sendCampaign);

export default subscribeRouter;
