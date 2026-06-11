import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { uploadMedia, deleteMedia } from '../controllers/upload.controller.js';

const router = express.Router();

// Upload media (image or video) - supports both 'file' and 'image' field names
router.post('/', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), uploadMedia);

// Delete media
router.delete('/', deleteMedia);

export default router;
