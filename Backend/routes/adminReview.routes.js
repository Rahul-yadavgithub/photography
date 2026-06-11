import express from 'express';
import { 
    getAllReviewsAdmin, 
    approveReview, 
    rejectReview, 
    deleteReview 
} from '../controllers/review.controller.js';

const router = express.Router();

router.route('/')
    .get(getAllReviewsAdmin);

router.route('/:id/approve')
    .patch(approveReview);

router.route('/:id/reject')
    .patch(rejectReview);

router.route('/:id')
    .delete(deleteReview);

export default router;
