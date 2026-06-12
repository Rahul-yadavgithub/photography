import express from 'express';
import { getDashboardData } from '../controllers/filmDashboard.controller.js';

const router = express.Router();

router.route('/')
  .get(getDashboardData);

export default router;
