import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const booking = await db.collection('bookings').findOne({ bookingReference: 'BKG-ZT65I2VL' });
    console.log("Booking Refund Status:", booking.refundStatus);
    console.log("Booking Admin Notes:", booking.adminNotes);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
