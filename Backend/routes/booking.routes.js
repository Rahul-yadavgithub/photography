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

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(getAllBookings); // Assuming public or admin token middleware is not yet strictly required based on the simple setup

router.route('/verify-payment')
  .post(verifyPayment);

router.route('/user/:userId')
  .get(getBookingsByUser);

router.route('/:id')
  .get(getBookingById);

router.route('/:id/status')
  .patch(updateBookingStatus);

router.route('/:id/approve')
  .put(approveBooking);

router.route('/:id/reject')
  .put(rejectBooking);

router.route('/:id/cancel')
  .put(cancelBooking);

router.route('/:id/archive')
  .put(archiveBooking);

router.route('/:id')
  .delete(deleteBooking);

export default router;
