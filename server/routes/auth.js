import { Router } from "express";
const router = Router();
import {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  updateProfileValidation,
} from "../middleware/validate.js";

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/me", protect, getMe);
router.put(
  "/update-password",
  protect,
  updatePasswordValidation,
  updatePassword
);
router.put("/update-profile", protect, updateProfileValidation, updateProfile);

export default router;
