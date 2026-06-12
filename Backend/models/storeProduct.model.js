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
  
  // Dynamic Specifications Map
  specifications: {
    type: Map,
    of: String,
    default: {}
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
  advancePercentage: {
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
storeProductSchema.pre('validate', async function() {
  if (this.name && (!this.slug || this.isModified('name'))) {
    let baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let uniqueSlug = baseSlug;
    
    // Ensure slug is unique
    if (this.constructor && this.constructor.findOne) {
      let existingProduct = await this.constructor.findOne({ slug: uniqueSlug, _id: { $ne: this._id } });
      let count = 1;
      while (existingProduct) {
        uniqueSlug = `${baseSlug}-${count}`;
        existingProduct = await this.constructor.findOne({ slug: uniqueSlug, _id: { $ne: this._id } });
        count++;
      }
    }
    this.slug = uniqueSlug;
  }
  
  // Auto-calculate discount percentage if not explicitly set and salePrice exists
  if (this.basePrice && this.salePrice && this.basePrice > this.salePrice && this.isModified('salePrice')) {
      this.discountPercentage = Math.round(((this.basePrice - this.salePrice) / this.basePrice) * 100);
  }
});

const StoreProduct = mongoose.model('StoreProduct', storeProductSchema);
export default StoreProduct;
