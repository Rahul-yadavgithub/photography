import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String, // Clerk User ID
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  enquiryType: {
    type: String,
    required: true,
  },
  packageId: {
    type: mongoose.Schema.Types.Mixed,
  },
  packageName: {
    type: String,
  },
  selectedPackageSnapshot: {
    type: mongoose.Schema.Types.Mixed,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventLocation: {
    type: String,
  },
  notes: {
    type: String,
  },
  specialInstructions: {
    type: String,
  },
  extraRequirements: {
    type: String,
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  advancePlan: {
    type: String, // e.g. "Option A", "Option B", "Option C"
    required: true,
  },
  advancePercentage: {
    type: Number,
    required: true,
  },
  selectedBenefits: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  }
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
