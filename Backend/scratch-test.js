import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    console.log("Success! Found bookings:", bookings.length);
  } catch (e) {
    console.error("Error executing query:", e);
  }
  process.exit(0);
});
