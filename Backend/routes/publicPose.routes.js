import express from 'express';
import {
    getAllPublishedPoses,
    getPublishedPosesByCategory
} from '../controllers/pose.controller.js';

const router = express.Router();

router.get('/', getAllPublishedPoses);
router.get('/category/:categoryId', getPublishedPosesByCategory);

export default router;
