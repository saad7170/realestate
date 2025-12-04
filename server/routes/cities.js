import { Router } from 'express';
const router = Router();
import {
  getCities,
  getCity,
  getCityAreas,
  seedCitiesData
} from '../controllers/cityController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getCities);
router.get('/:identifier', getCity);
router.get('/:identifier/areas', getCityAreas);
router.post('/seed', seedCitiesData); // Temporarily public for easy setup

// Admin routes (commented out for now)
// router.post('/seed', protect, authorize('admin'), seedCitiesData);

export default router;
