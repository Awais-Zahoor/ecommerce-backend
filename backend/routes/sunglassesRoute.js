import express from 'express'
import { listSunglasses, addSunglasses, removeSunglasses, singleSunglasses, updateSunglasses, updateSunglassesStatus, getRelatedSunglasses } from '../controllers/sunglassesController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'

const sunglassesRouter = express.Router();

// Strict 3D model only upload
sunglassesRouter.post('/add', adminAuth, upload.fields([{ name: 'model3D', maxCount: 1 }]), addSunglasses);
sunglassesRouter.post('/update', adminAuth, upload.fields([{ name: 'model3D', maxCount: 1 }]), updateSunglasses);

sunglassesRouter.get('/list', listSunglasses);
sunglassesRouter.post('/remove', adminAuth, removeSunglasses);
sunglassesRouter.post('/single', singleSunglasses);
sunglassesRouter.post('/update-status', adminAuth, updateSunglassesStatus);
sunglassesRouter.get('/related', getRelatedSunglasses);

export default sunglassesRouter;
