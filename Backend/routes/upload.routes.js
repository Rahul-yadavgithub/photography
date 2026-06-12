import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { uploadMedia, deleteMedia } from '../controllers/upload.controller.js';
import { requireClerkAuth, requireAdmin } from '../middlewares/auth.js';
import { uploadLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Upload media (image or video) - supports both 'file' and 'image' field names
router.post('/', requireClerkAuth, requireAdmin, uploadLimiter, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), uploadMedia);

// Delete media
router.delete('/', requireClerkAuth, requireAdmin, uploadLimiter, deleteMedia);

export default router;
