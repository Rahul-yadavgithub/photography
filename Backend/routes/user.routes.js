import express from 'express';
import { syncUser, getAllUsers, getUserById } from '../controllers/user.controller.js';

const router = express.Router();

// Routes
router.post('/sync', syncUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
