import { requireAuth } from '@clerk/clerk-sdk-node';

export const requireClerkAuth = (req, res, next) => {
  console.log("Auth Header Received:", req.headers.authorization);
  return requireAuth()(req, res, next);
};
