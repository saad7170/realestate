import { Router } from 'express';
const router = Router();
import { upload } from '../config/cloudinary.js';
import {
  uploadImage,
  uploadImages,
  deleteImage
} from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
      error: err.code || 'UPLOAD_ERROR'
    });
  }
  next();
};

// All upload routes are protected
router.post('/image', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, uploadImage);

router.post('/images', protect, (req, res, next) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, uploadImages);

router.delete('/image', protect, deleteImage);

export default router;
