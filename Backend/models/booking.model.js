import mongoose from 'mongoose';

export const BOOKING_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  // Legacy statuses
  LEGACY_PENDING: 'Pending',
  LEGACY_CONTACTED: 'Contacted',
  LEGACY_CONFIRMED: 'Confirmed',
  LEGACY_COMPLETED: 'Completed',
  LEGACY_CANCELLED: 'Cancelled'
};

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
  },
  inquiryType: {
    type: String,
    enum: ['service', 'product'],
    default: 'service'
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
  productData: {
    type: mongoose.Schema.Types.Mixed,
  },
  eventDate: {
    type: Date,
    required: function() { return this.inquiryType === 'service'; }
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
    required: function() { return this.inquiryType === 'service'; }
  },
  advancePercentage: {
    type: Number,
    required: function() { return this.inquiryType === 'service'; }
  },
  selectedBenefits: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    // Maintaining old statuses (Pending, Contacted, Confirmed, Completed, Cancelled) for backward compatibility
    // and adding new lowercase ones just in case.
    enum: ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled', 'draft', 'pending_approval', 'approved', 'rejected', 'cancelled'],
    default: 'Pending',
  },
  // New unified booking architecture fields
  bookingStatus: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'cancelled'],
    default: 'draft',
  },
  paymentStatus: {
    type: String,
    enum: ['not_required', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'not_required',
  },
  refundStatus: {
    type: String,
    enum: ['not_required', 'pending', 'processed', 'failed'],
    default: 'not_required',
  },
  paymentId: { type: String },
  orderId: { type: String },
  refundId: { type: String },
  amountPaid: {
    type: Number,
    default: 0
  },
  advanceAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  adminNotes: { type: String },
  rejectionReason: { type: String },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Computed property for deletion eligibility
bookingSchema.virtual('canDelete').get(function() {
  const status = this.bookingStatus || this.status;
  if (status !== 'rejected') return false;

  // Rule: If rejected, allow delete ONLY IF payment is not required OR refund is fully processed/partially_refunded/not_required
  if (this.paymentStatus === 'not_required' || this.paymentStatus === 'failed') return true;
  if (this.paymentStatus === 'paid' && (this.refundStatus === 'processed' || this.refundStatus === 'partially_refunded' || this.refundStatus === 'not_required')) return true;
  if (this.paymentStatus === 'refunded') return true;

  return false;
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
