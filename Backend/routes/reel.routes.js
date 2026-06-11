import express from 'express';
import {
    getReels,
    getReel,
    createReel,
    updateReel,
    deleteReel
} from '../controllers/reel.controller.js';

const router = express.Router();

router.route('/')
    .get(getReels)
    .post(createReel);

router.route('/:id')
    .get(getReel)
    .put(updateReel)
    .delete(deleteReel);

export default router;
