const express = require('express');

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

router.get('/profile',
  authMiddleware.authenticate,
  userController.getProfile
);

router.put('/profile',
  authMiddleware.authenticate,
  validationMiddleware.validateProfileUpdate,
  userController.updateProfile
);

router.put('/change-password',
  authMiddleware.authenticate,
  validationMiddleware.validatePasswordChange,
  userController.changePassword
);

router.delete('/account',
  authMiddleware.authenticate,
  userController.deleteAccount
);

router.post('/product-signup',
  authMiddleware.authenticate,
  userController.addProductSubscription
);

router.get('/',
  authMiddleware.authenticate,
  authMiddleware.requireRole(['admin']),
  userController.getAllUsers
);

module.exports = router;
