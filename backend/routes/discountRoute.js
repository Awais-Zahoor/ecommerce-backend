import express from 'express';
import {
    createDiscount,
    listDiscounts,
    updateDiscount,
    deleteDiscount,
    toggleDiscount,
    validateDiscount,
    applyDiscount,
    getAutoDiscounts
} from '../controllers/discountController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const discountRouter = express.Router();

// ── Admin Routes ───────────────────────────────────────────────────────────────
discountRouter.post('/create', adminAuth, createDiscount);
discountRouter.get('/list',   adminAuth, listDiscounts);
discountRouter.post('/update', adminAuth, updateDiscount);
discountRouter.post('/delete', adminAuth, deleteDiscount);
discountRouter.post('/toggle', adminAuth, toggleDiscount);

// ── Public/User Routes ─────────────────────────────────────────────────────────
discountRouter.post('/validate', authUser, validateDiscount);
discountRouter.post('/apply', authUser, applyDiscount);
discountRouter.get('/auto',   getAutoDiscounts);

export default discountRouter;
