import express from 'express';
import { getPublicCategories, getPublicProducts, getProductBySlug } from '../controllers/store.controller.js';

const router = express.Router();

router.get('/categories', getPublicCategories);
router.get('/products', getPublicProducts);
router.get('/products/:slug', getProductBySlug);

export default router;
