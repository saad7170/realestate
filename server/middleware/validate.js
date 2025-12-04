import { body, param, validationResult } from "express-validator";

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),

  body("role")
    .optional()
    .isIn(["buyer", "seller", "agent"])
    .withMessage("Invalid role"),

  handleValidationErrors,
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

export const createPropertyValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 50, max: 2000 })
    .withMessage("Description must be between 50 and 2000 characters"),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn(["buy", "rent"])
    .withMessage("Purpose must be either buy or rent"),

  body("propertyType")
    .notEmpty()
    .withMessage("Property type is required")
    .isIn(["home", "plot", "commercial"])
    .withMessage("Invalid property type"),

  body("subType").trim().notEmpty().withMessage("Sub-type is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Price cannot be negative"),

  body("area.value")
    .notEmpty()
    .withMessage("Area value is required")
    .isNumeric()
    .withMessage("Area must be a number")
    .custom((value) => value > 0)
    .withMessage("Area must be greater than 0"),

  body("area.unit")
    .notEmpty()
    .withMessage("Area unit is required")
    .isIn(["marla", "kanal", "sq-ft", "sq-yard", "sq-meter"])
    .withMessage("Invalid area unit"),

  body("location.city").trim().notEmpty().withMessage("City is required"),

  body("location.area")
    .trim()
    .notEmpty()
    .withMessage("Area/Location is required"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((value) => !value || value.length <= 20)
    .withMessage("Cannot upload more than 20 images"),

  handleValidationErrors,
];

export const createInquiryValidation = [
  body("property")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid property ID"),

  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone").trim().notEmpty().withMessage("Phone is required"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Message must be between 10 and 500 characters"),

  handleValidationErrors,
];

export const mongoIdValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  handleValidationErrors,
];

export const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  handleValidationErrors,
];

export const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),

  body("avatar")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL"),

  handleValidationErrors,
];
