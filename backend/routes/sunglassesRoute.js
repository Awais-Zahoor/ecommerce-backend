import express from 'express';
import { addSunglasses, listSunglasses, singleSunglasses, updateSunglasses, removeSunglasses } from '../controllers/sunglassesController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const sunglassesRouter = express.Router();

sunglassesRouter.post('/add', adminAuth, upload.fields([{ name: 'images', maxCount: 4 }, { name: 'deeparAsset', maxCount: 1 }]), addSunglasses);
sunglassesRouter.get('/list', listSunglasses);
sunglassesRouter.get('/single/:id', singleSunglasses);
sunglassesRouter.post('/update/:id', adminAuth, updateSunglasses);
sunglassesRouter.post('/remove', adminAuth, removeSunglasses);

export default sunglassesRouter;
