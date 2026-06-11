import mongoose from 'mongoose';

const filmCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  coverImage: { type: String },
  heroBanners: [{ type: String }],
  btsGallery: [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('FilmCategory', filmCategorySchema);
