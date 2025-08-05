const express = require('express');
const rateLimit = require('express-rate-limit');

const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// Rate limiting for profile endpoints
const profileRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many profile requests, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for file uploads
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: {
    error: 'Too many upload attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

const router = express.Router();

// All profile routes require authentication
router.use(authMiddleware.authenticate);

// Get current user profile
router.get('/',
  profileRateLimit,
  profileController.getProfile
);

// Update profile information
router.put('/',
  profileRateLimit,
  profileController.updateProfile
);

// Complete profile setup (mandatory after first login)
router.post('/complete',
  profileRateLimit,
  profileController.completeProfile
);

// Upload profile avatar
router.post('/avatar',
  uploadRateLimit,
  profileController.uploadMiddleware,
  profileController.uploadAvatar
);

// Delete profile avatar
router.delete('/avatar',
  profileRateLimit,
  profileController.deleteAvatar
);

// Change password
router.put('/password',
  profileRateLimit,
  profileController.changePassword
);

// Get profile status (completeness, verification, etc.)
router.get('/status',
  profileRateLimit,
  profileController.getProfileStatus
);

module.exports = router;