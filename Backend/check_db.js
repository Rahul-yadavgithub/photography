import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const reviewSchema = new mongoose.Schema({}, { strict: false });
const Review = mongoose.model('Review', reviewSchema, 'reviews');

async function check() {
    const reviews = await Review.find();
    console.log("Reviews in 'reviews' collection:", reviews.length);
    console.log(reviews);
    
    // Maybe they are stored elsewhere? 
    // What was the old model?
    process.exit();
}
check();
