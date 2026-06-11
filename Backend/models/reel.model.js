import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema({
  title: { type: String },
  category: { type: String },
  duration: { type: String },
  thumbnail: { type: String },
  videoUrl: { type: String },
  videoSource: { type: String, enum: ['youtube', 'vimeo', 'upload', 'url', 'instagram', 'youtube_shorts'], default: 'instagram' },
  trending: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Draft' },
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Reel', reelSchema);
