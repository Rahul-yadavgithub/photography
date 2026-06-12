import Booking from '../models/booking.model.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    // Generate a unique booking reference (e.g., BKG-12345678)
    const bookingReference = `BKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    const booking = await Booking.create({
      bookingReference,
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
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in creating booking',
    });
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
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
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
