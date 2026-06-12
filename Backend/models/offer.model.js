import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'Percentage Discount', 
      'Flat Discount', 
      'Free Album', 
      'Free Reel', 
      'Free Drone Shoot', 
      'Free Extra Hours', 
      'Complimentary Gift', 
      'Festival Offer', 
      'Limited Time Offer'
    ]
  },
  description: { type: String },
  badgeText: { type: String, required: true },
  discountPercentage: { type: Number },
  flatDiscountAmount: { type: Number },
  freeAddon: { type: String },
  validFrom: { type: Date },
  validUntil: { type: Date },
  priority: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
  applicablePackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }]
}, {
  timestamps: true
});

export default mongoose.model('Offer', offerSchema);
