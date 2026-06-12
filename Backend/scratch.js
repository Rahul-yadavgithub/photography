import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");
  const result = await User.updateMany({}, { role: 'admin' });
  console.log(`Updated ${result.modifiedCount} users to admin role`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
