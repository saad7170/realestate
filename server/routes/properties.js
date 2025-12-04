import { Router } from 'express';
const router = Router();
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getSimilarProperties,
  getFeaturedProperties,
  getMyProperties,
  getPropertyStats,
  seedPropertiesData,
  clearPropertiesData
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import {
  createPropertyValidation
} from '../middleware/validate.js';

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/stats', getPropertyStats);
router.post('/seed', seedPropertiesData);  // Seed sample properties
router.delete('/seed', clearPropertiesData);  // Clear all properties
router.get('/:id', getProperty);
router.get('/:id/similar', getSimilarProperties);

// Protected routes
router.get('/user/my-properties', protect, getMyProperties);
router.post('/', protect, createPropertyValidation, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
