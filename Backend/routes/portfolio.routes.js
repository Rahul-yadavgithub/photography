import express from 'express';
import { getPortfolio, getPortfolioGallery } from '../controllers/portfolio.controller.js';

const router = express.Router();

router.get('/', getPortfolio);
router.get('/gallery', getPortfolioGallery);

export default router;
