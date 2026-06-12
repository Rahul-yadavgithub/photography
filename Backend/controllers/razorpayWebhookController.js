import crypto from 'crypto';
import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret')
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Webhook Signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const { event, payload } = req.body;
    console.log(`Received Webhook Event: ${event}`);

    switch (event) {
      case 'payment.captured': {
        const paymentEntity = payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        // Find the booking associated with this order
        const booking = await Booking.findOne({ orderId });
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.paymentId = paymentId;
          if (booking.bookingStatus === 'draft') {
            booking.bookingStatus = 'pending_approval';
          }
          await booking.save();

          // Upsert payment record
          await Payment.findOneAndUpdate(
            { razorpayPaymentId: paymentId },
            {
              bookingId: booking._id,
              userId: booking.userId,
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              amount: paymentEntity.amount / 100, // convert paise to INR
              status: 'captured',
              paymentMethod: paymentEntity.method,
              transactionDate: new Date(paymentEntity.created_at * 1000),
            },
            { upsert: true, new: true }
          );
        }
        break;
      }
      
      case 'payment.failed': {
        const paymentEntity = payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        const booking = await Booking.findOne({ orderId });
        if (booking) {
          booking.paymentStatus = 'failed';
          await booking.save();

          await Payment.findOneAndUpdate(
            { razorpayPaymentId: paymentId },
            {
              bookingId: booking._id,
              userId: booking.userId,
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              amount: paymentEntity.amount / 100,
              status: 'failed',
              errorDescription: paymentEntity.error_description,
              transactionDate: new Date(paymentEntity.created_at * 1000),
            },
            { upsert: true, new: true }
          );
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = payload.refund.entity;
        const paymentId = refundEntity.payment_id;

        const booking = await Booking.findOne({ paymentId });
        if (booking) {
          booking.refundStatus = 'processed';
          if (!['rejected', 'cancelled'].includes(booking.bookingStatus)) {
             // In case it was refunded externally
             booking.bookingStatus = 'cancelled';
             booking.status = 'Cancelled';
          }
          booking.paymentStatus = 'refunded';
          await booking.save();

          await Payment.findOneAndUpdate(
            { razorpayPaymentId: paymentId },
            { 
              status: 'refunded',
              razorpayRefundId: refundEntity.id 
            }
          );
        }
        break;
      }

      case 'refund.failed': {
        const refundEntity = payload.refund.entity;
        const paymentId = refundEntity.payment_id;

        const booking = await Booking.findOne({ paymentId });
        if (booking) {
          booking.refundStatus = 'failed';
          booking.adminNotes = `Webhook: Refund failed for refund ID ${refundEntity.id}`;
          await booking.save();
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing webhook' });
  }
};
