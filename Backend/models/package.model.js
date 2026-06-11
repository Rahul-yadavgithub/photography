import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  iconKey: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  iconKey: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  
  // Descriptions
  shortDesc: { type: String, maxLength: 120 },
  description: { type: String },
  
  // Pricing
  price: { type: Number },
  discountPrice: { type: Number },
  
  // Media
  media: {
    thumbnail: { type: String },
    banner: { type: String },
    gallery: [{ type: String }],
    videoUrl: { type: String }
  },
  
  // Features and Add-ons
  features: [featureSchema],
  addOns: [addOnSchema],
  
  // Settings & Status
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  showPricing: { type: Boolean, default: true },
  allowAddOns: { type: Boolean, default: true },
  availability: { type: String, default: 'Available' },
  
  // Control ordering on frontend
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Package', packageSchema);
