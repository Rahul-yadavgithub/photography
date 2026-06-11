import express from 'express';
import { createReview, getApprovedReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.route('/')
    .post(createReview)
    .get(getApprovedReviews);

export default router;
