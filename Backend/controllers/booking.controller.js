import Booking, { BOOKING_STATUS } from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import AuditLog from '../models/auditLog.model.js';
import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendAdminNotification } from '../utils/notification.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = catchAsync(async (req, res, next) => {
    const {
      inquiryType,
      productData,
      userId,
      customerName,
      mobileNumber,
      enquiryType,
      packageId,
      packageName,
      selectedPackageSnapshot,
      eventDate,
      eventLocation,
      notes,
      specialInstructions,
      extraRequirements,
      requirements,
      advancePlan,
      advancePercentage,
      selectedBenefits,
      isAdvancePayment, // Boolean to indicate Option A vs Option B
      totalAmount, // From frontend calculation or snapshot
      advanceAmount // From frontend calculation
    } = req.body;

    if (!userId) {
      return next(new AppError('userId is required', 400));
    }

    // Generate a unique booking reference
    const bookingReference = `BKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Determine initial statuses
    let initialBookingStatus = 'pending_approval';
    let initialPaymentStatus = 'not_required';
    
    if (inquiryType !== 'product' && isAdvancePayment) {
      initialBookingStatus = 'draft';
      initialPaymentStatus = 'pending';
    }
    
    // For backward compatibility
    let legacyStatus = 'Pending';

    // Build the booking payload
    const bookingPayload = {
      bookingReference,
      inquiryType: inquiryType || 'service',
      userId,
      customerName,
      mobileNumber,
      enquiryType, // Reused as dynamic category grouping
      productData,
      packageId,
      packageName,
      selectedPackageSnapshot,
      eventDate,
      eventLocation,
      notes,
      specialInstructions,
      extraRequirements,
      requirements,
      advancePlan,
      advancePercentage,
      selectedBenefits,
      status: legacyStatus,
      bookingStatus: initialBookingStatus,
      paymentStatus: initialPaymentStatus,
      refundStatus: 'not_required',
      totalAmount: totalAmount || 0,
      advanceAmount: advanceAmount || 0,
      amountPaid: 0,
    };

    let order = null;

    // If advance payment is required, create a Razorpay order
    if (isAdvancePayment && advanceAmount > 0) {
      const options = {
        amount: Math.round(advanceAmount * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: bookingReference,
      };

      try {
        order = await razorpay.orders.create(options);
        bookingPayload.orderId = order.id;
      } catch (razorpayError) {
        console.error('Razorpay Error:', razorpayError);
        return res.status(500).json({ success: false, message: 'Failed to create payment order.' });
      }
    }

    const booking = await Booking.create(bookingPayload);

    // If no advance payment is required, the booking is effectively submitted. Trigger notification.
    if (!isAdvancePayment || advanceAmount === 0) {
      sendAdminNotification(booking);
    }

    res.status(201).json({
      success: true,
      data: booking,
      order: order // Send order details to frontend for Razorpay Checkout
    });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/bookings/verify-payment
// @access  Public
export const verifyPayment = catchAsync(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'pending_approval';
    booking.paymentId = razorpay_payment_id;
    booking.amountPaid = booking.advanceAmount;
    await booking.save();

    // Create payment record
    await Payment.create({
      bookingId: booking._id,
      userId: booking.userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: booking.advanceAmount,
      status: 'captured', // Initially assuming captured via checkout
      paymentMethod: 'Online',
      transactionDate: new Date(),
    });

    // Payment is verified, so the booking is officially submitted. Trigger notification.
    sendAdminNotification(booking);

    res.status(200).json({ success: true, message: 'Payment verified successfully', data: booking });
});

// @desc    Approve a booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Admin)
export const approveBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus: BOOKING_STATUS.APPROVED,
        status: BOOKING_STATUS.LEGACY_APPROVED || 'Approved' // Handle legacy just in case
      },
      { returnDocument: 'after' }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await AuditLog.create({
      action: 'Approved',
      adminId: (req.body && req.body.adminId) ? req.body.adminId : 'admin',
      requestId: booking._id
    });

    res.status(200).json({ success: true, data: booking });
});

// @desc    Reject a booking and trigger refund if paid
// @route   PUT /api/bookings/:id/reject
// @access  Private (Admin)
export const rejectBooking = catchAsync(async (req, res, next) => {
    const { rejectionReason } = req.body;
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let refundId = booking.refundId;
    let refundStatus = booking.refundStatus;
    let adminNotes = booking.adminNotes;

    // Trigger refund if payment was made
    if (booking.paymentStatus === 'paid' && booking.paymentId) {
      try {
        const refund = await razorpay.payments.refund(booking.paymentId, {
          notes: {
            reason: 'Booking rejected by admin',
            bookingId: booking._id.toString()
          }
        });
        
        refundId = refund.id;
        refundStatus = 'pending'; // Will be updated by webhook
      } catch (refundError) {
        console.error('Razorpay Refund Error:', refundError);
        refundStatus = 'failed';
        const errorMessage = refundError.error?.description || refundError.message || 'Unknown error';
        adminNotes = `Refund failed: ${errorMessage}`;
      }
    }

    // Use findByIdAndUpdate to avoid full document validation
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus: BOOKING_STATUS.REJECTED,
        status: BOOKING_STATUS.REJECTED,
        rejectionReason,
        refundId,
        refundStatus,
        adminNotes
      },
      { returnDocument: 'after' }
    );

    await AuditLog.create({
      action: 'Rejected',
      adminId: req.body.adminId || 'admin',
      requestId: booking._id
    });

    if (refundStatus === 'pending') {
      await AuditLog.create({
        action: 'Refund Initiated',
        adminId: req.body.adminId || 'admin',
        requestId: booking._id
      });
    }

    res.status(200).json({ success: true, data: booking });
});

// @desc    Permanently delete a booking (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!booking.canDelete) {
      return res.status(400).json({ success: false, message: 'This booking cannot be permanently deleted based on its current status or payment/refund state.' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      action: 'Deleted',
      adminId: req.query.adminId || 'admin',
      requestId: req.params.id
    });

    res.status(200).json({ success: true, message: 'Booking permanently deleted' });
});

// @desc    Cancel a booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Public / Private
export const cancelBooking = catchAsync(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only allow cancellation if pending_approval or draft
    if (!['draft', 'pending_approval'].includes(booking.bookingStatus)) {
      return res.status(400).json({ success: false, message: 'Booking cannot be cancelled at this stage' });
    }

    // Do not allow cancellation if payment exists (Rule 2)
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking cannot be cancelled because payment has been received. Please contact support.' });
    }

    let refundId = booking.refundId;
    let refundStatus = booking.refundStatus;
    let adminNotes = booking.adminNotes;

    // Trigger refund if payment was made
    if (booking.paymentStatus === 'paid' && booking.paymentId) {
      try {
        const refund = await razorpay.payments.refund(booking.paymentId, {
          notes: {
            reason: 'Booking cancelled by user',
            bookingId: booking._id.toString()
          }
        });
        
        refundId = refund.id;
        refundStatus = 'pending'; // Will be updated by webhook
      } catch (refundError) {
        console.error('Razorpay Refund Error:', refundError);
        refundStatus = 'failed';
        const errorMessage = refundError.error?.description || refundError.message || 'Unknown error';
        adminNotes = `Refund failed: ${errorMessage}`;
      }
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus: BOOKING_STATUS.CANCELLED,
        status: BOOKING_STATUS.LEGACY_CANCELLED || 'Cancelled',
        refundId,
        refundStatus,
        adminNotes
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, data: booking });
});

// @desc    Archive a booking (Customer/Admin)
// @route   PUT /api/bookings/:id/archive
// @access  Public / Private
export const archiveBooking = catchAsync(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Rule 4: Booking Rejected AND Refund Completed OR Not Required -> Allow archive
    if (booking.bookingStatus !== 'rejected' && booking.bookingStatus !== 'cancelled') {
      return res.status(400).json({ success: false, message: 'Only rejected or cancelled bookings can be archived' });
    }

    if (booking.refundStatus === 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot archive booking while refund is being processed' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, data: booking });
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: bookings,
    });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Admin)
export const getBookingById = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
});

// @desc    Get bookings by user ID
// @route   GET /api/bookings/user/:userId
// @access  Public / Private
export const getBookingsByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId, isArchived: { $ne: true } }).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: bookings,
    });
});
