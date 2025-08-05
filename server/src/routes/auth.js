const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const { googleAuthSecurityMiddleware } = require('../middleware/googleAuthSecurity');

// Stricter rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again in 15 minutes.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const router = express.Router();

router.post('/register',
  authRateLimit,
  validationMiddleware.validateRegistration,
  authController.register
);

router.post('/login',
  authRateLimit,
  validationMiddleware.validateLogin,
  authController.login
);

router.post('/logout',
  authMiddleware.authenticate,
  authController.logout
);

router.get('/verify',
  authMiddleware.authenticate,
  authController.verifyToken
);

router.post('/refresh',
  authMiddleware.authenticate,
  authController.refreshToken
);

// OAuth routes with enhanced security
router.post('/google',
  ...googleAuthSecurityMiddleware,
  authController.googleAuth
);

router.post('/facebook',
  authController.facebookAuth
);

// Email verification routes
router.get('/verify-email',
  authController.verifyEmail
);

router.post('/resend-verification',
  authRateLimit,
  authController.resendVerification
);

router.get('/check-email',
  authController.checkEmail
);

module.exports = router;
