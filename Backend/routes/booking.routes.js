import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingsByUser,
  verifyPayment,
  approveBooking,
  rejectBooking,
  cancelBooking,
  archiveBooking,
  deleteBooking
} from '../controllers/booking.controller.js';
import { requireClerkAuth, requireAdmin } from '../middlewares/auth.js';
import { adminLimiter, inquiryLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.route('/')
  .post(inquiryLimiter, createBooking)
  .get(requireClerkAuth, requireAdmin, adminLimiter, getAllBookings);

router.route('/verify-payment')
  .post(verifyPayment); // Public, relies on razorpay signature

router.route('/user/:userId')
  .get(requireClerkAuth, getBookingsByUser);

router.route('/:id')
  .get(requireClerkAuth, requireAdmin, getBookingById);

router.route('/:id/status')
  .patch(requireClerkAuth, requireAdmin, adminLimiter, updateBookingStatus);

router.route('/:id/approve')
  .put(requireClerkAuth, requireAdmin, adminLimiter, approveBooking);

router.route('/:id/reject')
  .put(requireClerkAuth, requireAdmin, adminLimiter, rejectBooking);

router.route('/:id/cancel')
  .put(requireClerkAuth, cancelBooking);

router.route('/:id/archive')
  .put(requireClerkAuth, archiveBooking);

router.route('/:id')
  .delete(requireClerkAuth, requireAdmin, adminLimiter, deleteBooking);

export default router;
