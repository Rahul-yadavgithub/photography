import Booking, { BOOKING_STATUS } from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import AuditLog from '../models/auditLog.model.js';
import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
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
      return res.status(400).json({ success: false, message: 'userId is required' });
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

    res.status(201).json({
      success: true,
      data: booking,
      order: order // Send order details to frontend for Razorpay Checkout
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in creating booking',
    });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/bookings/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
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

    res.status(200).json({ success: true, message: 'Payment verified successfully', data: booking });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server Error verifying payment' });
  }
};

// @desc    Approve a booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Admin)
export const approveBooking = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ success: false, message: 'Server Error approving booking' });
  }
};

// @desc    Reject a booking and trigger refund if paid
// @route   PUT /api/bookings/:id/reject
// @access  Private (Admin)
export const rejectBooking = async (req, res) => {
  try {
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
        adminNotes = `Refund failed: ${refundError.description || refundError.message}`;
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
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ success: false, message: 'Server Error rejecting booking' });
  }
};

// @desc    Permanently delete a booking (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting booking' });
  }
};

// @desc    Cancel a booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Public / Private
export const cancelBooking = async (req, res) => {
  try {
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
        adminNotes = `Refund failed: ${refundError.description || refundError.message}`;
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
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Server Error cancelling booking' });
  }
};

// @desc    Archive a booking (Customer/Admin)
// @route   PUT /api/bookings/:id/archive
// @access  Public / Private
export const archiveBooking = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error archiving booking:', error);
    res.status(500).json({ success: false, message: 'Server Error archiving booking' });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in fetching bookings',
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Admin)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in fetching booking',
    });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in updating booking status',
    });
  }
};

// @desc    Get bookings by user ID
// @route   GET /api/bookings/user/:userId
// @access  Public / Private
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId, isArchived: { $ne: true } }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in fetching user bookings',
    });
  }
};
