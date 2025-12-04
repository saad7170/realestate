import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllAgents,
  getAgentProfile,
  updateAgentProfile,
  getAgentProperties,
  getAgentStats
} from '../controllers/agentController.js';

const router = express.Router();

// Public routes
router.get('/', getAllAgents);
router.get('/:id', getAgentProfile);
router.get('/:id/properties', getAgentProperties);
router.get('/:id/stats', getAgentStats);

// Protected routes
router.put('/profile', protect, updateAgentProfile);

export default router;
