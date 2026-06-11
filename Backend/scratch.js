import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  heroHeading: { type: String },
  shortDescription: { type: String },
  fullDescription: { type: String }
});

const Cat = mongoose.model('Category', categorySchema, 'categories');

async function test() {
  try {
      const c = await Cat.findOne({ categoryName: /Corporate/i });
      console.log("Hero Heading:", JSON.stringify(c.heroHeading));
      console.log("Short Desc:", JSON.stringify(c.shortDescription));
  } catch (err) {
      console.log(err.message);
  }
  process.exit(0);
}
test();
