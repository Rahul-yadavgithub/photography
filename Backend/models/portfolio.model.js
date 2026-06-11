import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  awardName: { type: String, required: true },
  awardDescription: { type: String },
  awardYear: { type: Number },
  awardOrganization: { type: String },
  awardImage: { type: String },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { _id: true, timestamps: true });

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { _id: true, timestamps: true });

const portfolioSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, default: "OUR WORK" },
    subtitle: { type: String, default: "Crafting Stories Through Frames" },
    description: { type: String },
    heroImage: { type: String },
    backgroundImage: { type: String },
    buttonText: { type: String, default: "Book Your Shoot" },
    buttonLink: { type: String, default: "/packages" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  descriptionSection: {
    heading: { type: String, default: "Crafting Timeless Wedding Stories" },
    shortDescription: { type: String },
    fullDescription: { type: String },
    yearsOfExperience: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    happyClients: { type: Number, default: 0 },
    teamSize: { type: Number, default: 0 },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  achievements: [achievementSchema],
  collections: [collectionSchema]
}, {
  timestamps: true
});

export default mongoose.model('Portfolio', portfolioSchema);
