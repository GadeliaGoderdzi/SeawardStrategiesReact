const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

const validationMiddleware = {
  validateRegistration: [
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 25 })
      .withMessage('First name must be between 2 and 25 characters'),

    body('lastName')
      .trim()
      .isLength({ min: 2, max: 25 })
      .withMessage('Last name must be between 2 and 25 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),

    handleValidationErrors
  ],

  validateLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),

    handleValidationErrors
  ],

  validateProfileUpdate: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 25 })
      .withMessage('First name must be between 2 and 25 characters'),

    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 25 })
      .withMessage('Last name must be between 2 and 25 characters'),

    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

    body('currentPassword')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Current password is required when updating password'),

    body('newPassword')
      .optional()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

    handleValidationErrors
  ],

  validatePasswordChange: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),

    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      }),

    handleValidationErrors
  ],

  validateDataCreation: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),

    body('category')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),

    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each tag must be between 1 and 30 characters'),

    handleValidationErrors
  ],

  validateDataUpdate: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),

    body('category')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),

    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each tag must be between 1 and 30 characters'),

    handleValidationErrors
  ],

  validateObjectId: [
    param('id')
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid ID format');
        }
        return true;
      }),

    handleValidationErrors
  ],

  validateContactForm: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

    body('subject')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Subject must be between 5 and 100 characters'),

    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters'),

    handleValidationErrors
  ],

  validateProductSignup: [
    body('productName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),

    body('tier')
      .isIn(['basic', 'premium', 'enterprise'])
      .withMessage('Tier must be one of: basic, premium, enterprise'),

    handleValidationErrors
  ]
};

module.exports = validationMiddleware;
