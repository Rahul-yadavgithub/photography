import express from 'express';
import { syncUser, getAllUsers, getUserById } from '../controllers/user.controller.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Routes
router.post('/sync', authLimiter, syncUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
