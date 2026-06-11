import mongoose from 'mongoose';

const poseSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  poseName: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  bestTime: {
    type: String,
    required: true
  },
  bestLens: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Advanced']
  },
  shootingTips: {
    type: String
  },
  coupleInstructions: {
    type: String
  },
  photographerNotes: {
    type: String
  },
  tags: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: null
  },
  imagePublicId: {
    type: String,
    default: null
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('Pose', poseSchema);
