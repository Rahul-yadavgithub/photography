import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { User } from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const requireClerkAuth = (req, res, next) => {
  return ClerkExpressRequireAuth()(req, res, next);
};

export const requireAdmin = catchAsync(async (req, res, next) => {
  // First, ensure the user is authenticated via Clerk
  if (!req.auth || !req.auth.userId) {
    return next(new AppError('Unauthorized access. Please log in.', 401));
  }

  // Find user in database by Clerk ID
  const user = await User.findOne({ clerkId: req.auth.userId }).lean();

  if (!user) {
    return next(new AppError('User profile not found. Please sync your account.', 404));
  }

  if (user.role !== 'admin') {
    return next(new AppError('Forbidden. You do not have permission to perform this action.', 403));
  }

  // Attach user to request for downstream use
  req.user = user;
  next();
});
