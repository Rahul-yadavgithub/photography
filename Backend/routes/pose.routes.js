import express from 'express';
import {
    generatePoses,
    createPose,
    updatePose,
    deletePose,
    getPosesByCategory
} from '../controllers/pose.controller.js';

const router = express.Router();

router.post('/generate', generatePoses);
router.post('/', createPose);
router.put('/:id', updatePose);
router.delete('/:id', deletePose);
router.get('/category/:categoryId', getPosesByCategory);

export default router;
