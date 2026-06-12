import express from 'express';
import { getJourneyStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/journey', getJourneyStats);

export default router;
