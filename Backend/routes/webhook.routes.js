import express from 'express';
import { handleRazorpayWebhook } from '../controllers/razorpayWebhookController.js';

const router = express.Router();

// Razorpay webhook endpoint
router.route('/razorpay')
  .post(handleRazorpayWebhook);

export default router;
