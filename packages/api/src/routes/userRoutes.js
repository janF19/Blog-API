import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  logoutUser
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.post('/logout', authenticateUser, logoutUser);

export default router;