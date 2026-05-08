import express from 'express';
import { getBranding, updateBranding } from '../controllers/brandingController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const brandingRouter = express.Router();

brandingRouter.get('/get', getBranding);
brandingRouter.post('/update', adminAuth, upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'banner', maxCount: 1 }, 
    { name: 'flashBanner', maxCount: 1 },
    { name: 'categoryMen', maxCount: 1 },
    { name: 'categoryWomen', maxCount: 1 },
    { name: 'categoryKids', maxCount: 1 },
    { name: 'categoryImages', maxCount: 5 }, 
    { name: 'instaImages', maxCount: 10 }
]), updateBranding);

export default brandingRouter;
