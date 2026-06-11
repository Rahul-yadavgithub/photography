import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const categories = await mongoose.connection.collection('storecategories').find({}).toArray();
    console.log("Categories found:", categories.length);
    console.log(categories);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
