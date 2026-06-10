import { requireAuth } from '@clerk/clerk-sdk-node';

// This middleware ensures that the route is protected and only accessible by authenticated users via Clerk
export const requireClerkAuth = requireAuth();
