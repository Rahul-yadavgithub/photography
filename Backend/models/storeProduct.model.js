import mongoose from 'mongoose';

const storeProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    trim: true,
    required: [true, 'Short description is required']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreCategory',
    required: [true, 'Category is required']
  },
  
  // Media
  bannerImage: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  galleryImages: [{
    type: String
  }],
  
  // Album Specifications
  albumSize: {
    type: String, // e.g., '12x18', '8x12', 'Custom'
    trim: true
  },
  albumType: {
    type: String, // e.g., 'Premium Album', 'Coffee Table Book'
    trim: true
  },
  pageCount: {
    type: String, // e.g., '30 Pages', '50 Pages'
    trim: true
  },
  printQuality: {
    type: String, // e.g., 'HD', 'Ultra HD', 'Standard'
    trim: true
  },
  coverMaterial: {
    type: String, // e.g., 'Leather', 'Acrylic'
    trim: true
  },

  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Status and Meta
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out Of Stock', 'Pre Order'],
    default: 'In Stock'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to generate slug
storeProductSchema.pre('validate', function() {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  
  // Auto-calculate discount percentage if not explicitly set and salePrice exists
  if (this.basePrice && this.salePrice && this.basePrice > this.salePrice && this.isModified('salePrice')) {
      this.discountPercentage = Math.round(((this.basePrice - this.salePrice) / this.basePrice) * 100);
  }
});

const StoreProduct = mongoose.model('StoreProduct', storeProductSchema);
export default StoreProduct;
