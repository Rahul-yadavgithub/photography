import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import AppError from './utils/AppError.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { publicReadLimiter } from './middlewares/rateLimit.middleware.js';

// Catch uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Load env vars
dotenv.config();

// Ensure NODE_ENV defaults to development if undefined
process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim();

// Connect to database
connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Compress responses
app.use(compression());

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Auto-allow localhost and 127.0.0.1 for local development
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    console.error(`[CORS Blocked] Origin rejected: ${origin}`);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new AppError(msg, 403), false);
  },
  credentials: true
}));

// Body parser, reading data from body into req.body
// Limit body payload to 10kb to prevent oversized request attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
// Must be placed AFTER body parsers, and custom written to avoid Express 5 req.query getter bug
app.use((req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) {
      mongoSanitize.sanitize(req[key], { replaceWith: '_' });
    }
  });
  next();
});

// Apply public read limiter globally to all /api routes by default, 
// specific routes can have stricter limiters.
app.use('/api', publicReadLimiter);

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
import webhookRoutes from './routes/webhook.routes.js';
import filmDashboardRoutes from './routes/filmDashboard.routes.js';
import offerRoutes from './routes/offer.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import statsRoutes from './routes/stats.routes.js';

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
app.use('/api/webhooks', webhookRoutes);
app.use('/api/films-dashboard', filmDashboardRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stats', statsRoutes);

// Handle unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Catch unhandled rejections
process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', { error: err.name, message: err.message, stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});
