import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import bookingRoutes from './routes/booking.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import packageRoutes from './routes/package.routes.js';
import categoryRoutes from './routes/category.routes.js';
import filmRoutes from './routes/film.routes.js';
import filmCategoryRoutes from './routes/filmCategory.routes.js';
import reelRoutes from './routes/reel.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import storeRoutes from './routes/store.routes.js';
import adminPortfolioRoutes from './routes/adminPortfolio.routes.js';
import adminStoreRoutes from './routes/adminStore.routes.js';
import poseRoutes from './routes/pose.routes.js';
import publicPoseRoutes from './routes/publicPose.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminReviewRoutes from './routes/adminReview.routes.js';

// Basic route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Backend is running' });
});

// Mount Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/film-categories', filmCategoryRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/admin/portfolio', adminPortfolioRoutes);
app.use('/api/admin/store', adminStoreRoutes);
app.use('/api/admin/poses', poseRoutes);
app.use('/api/poses', publicPoseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
