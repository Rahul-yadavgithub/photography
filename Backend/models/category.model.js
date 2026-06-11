import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  
  // Marketing Content
  heroHeading: { type: String },
  shortDescription: { type: String },
  fullDescription: { type: String },
  
  // Feature highlights
  features: [{ type: String }],
  highlights: [{ type: String }],
  
  // FAQ
  faq: [faqSchema],
  
  // SEO
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  
  // Media (Manually uploaded)
  media: {
    thumbnail: { type: String },
    banner: { type: String }
  },

  // Settings
  displayOrder: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);
