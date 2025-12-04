import { Router } from 'express';
const router = Router();
import {
  getProfile,
  updateProfile,
  getUserProperties,
  getFavorites,
  addToFavorites,
  removeFromFavorites
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

// All user routes are protected
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/properties', protect, getUserProperties);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:propertyId', protect, addToFavorites);
router.delete('/favorites/:propertyId', protect, removeFromFavorites);

export default router;
