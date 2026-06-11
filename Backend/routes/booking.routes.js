import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingsByUser
} from '../controllers/booking.controller.js';

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(getAllBookings); // Assuming public or admin token middleware is not yet strictly required based on the simple setup

router.route('/user/:userId')
  .get(getBookingsByUser);

router.route('/:id')
  .get(getBookingById);

router.route('/:id/status')
  .patch(updateBookingStatus);

export default router;
