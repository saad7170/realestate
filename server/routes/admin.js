import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getDashboardStats,
  getPropertyStats,
  getAgentStats,
  getOwnerStats,
  getAllAgents,
  getAllOwners,
  getPropertiesByUser,
  getAllProperties,
  updatePropertyStatus,
  deleteProperty
} from '../controllers/adminController.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/users/:id/status', toggleUserStatus);

// Statistics routes
router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/properties', getPropertyStats);
router.get('/stats/agents', getAgentStats);
router.get('/stats/owners', getOwnerStats);

// Agent and owner routes
router.get('/agents', getAllAgents);
router.get('/owners', getAllOwners);

// Properties by user
router.get('/properties/:userId', getPropertiesByUser);

// Property management routes
router.get('/properties', getAllProperties);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

export default router;
