import mongoose from 'mongoose';

const filmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
  
  // Thumbnail
  thumbnail: { type: String },
  thumbnailVideo: { type: String },
  thumbnailType: { type: String, enum: ['image', 'video'], default: 'image' },
  
  // Video
  videoSource: { type: String, enum: ['youtube', 'vimeo', 'upload', 'url'], default: 'youtube' },
  videoUrl: { type: String },
  
  // Settings
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Draft' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Film', filmSchema);
