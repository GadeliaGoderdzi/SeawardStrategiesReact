const express = require('express');

const dataController = require('../controllers/dataController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

// Import route modules
const profileRoutes = require('./profile');

const router = express.Router();

router.get('/data',
  authMiddleware.authenticate,
  dataController.getData
);

router.get('/data/stats',
  authMiddleware.authenticate,
  dataController.getStats
);

router.get('/data/:id',
  authMiddleware.authenticate,
  validationMiddleware.validateObjectId,
  dataController.getDataById
);

router.post('/data',
  authMiddleware.authenticate,
  validationMiddleware.validateDataCreation,
  dataController.createData
);

router.put('/data/:id',
  authMiddleware.authenticate,
  validationMiddleware.validateObjectId,
  validationMiddleware.validateDataUpdate,
  dataController.updateData
);

router.delete('/data/:id',
  authMiddleware.authenticate,
  validationMiddleware.validateObjectId,
  dataController.deleteData
);

// Product signup endpoint
router.post('/product-signup',
  authMiddleware.authenticate,
  validationMiddleware.validateProductSignup,
  userController.addProductSubscription
);

// Legacy profile endpoints (for backward compatibility)
router.get('/profile',
  authMiddleware.authenticate,
  userController.getProfile
);

router.put('/profile',
  authMiddleware.authenticate,
  validationMiddleware.validateProfileUpdate,
  userController.updateProfile
);

// Enhanced profile routes
router.use('/profile', profileRoutes);

module.exports = router;
