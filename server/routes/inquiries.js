import { Router } from 'express';
const router = Router();
import {
  createInquiry,
  getPropertyInquiries,
  getSentInquiries,
  getReceivedInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';
import { createInquiryValidation } from '../middleware/validate.js';

// All inquiry routes are protected
router.post('/', protect, createInquiryValidation, createInquiry);
router.get('/sent', protect, getSentInquiries);
router.get('/received', protect, getReceivedInquiries);
router.get('/property/:propertyId', protect, getPropertyInquiries);
router.put('/:id', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
