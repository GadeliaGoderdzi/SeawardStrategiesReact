const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authMiddleware = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const token = authHeader.substring(7);

      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated.' });
      }

      req.userId = decoded.userId;
      req.user = user;

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token.' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
      }

      console.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Server error during authentication.' });
    }
  },

  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: 'Access denied. Insufficient permissions.'
        });
      }

      next();
    };
  },

  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.substring(7);

      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.userId = decoded.userId;
        req.user = user;
      }

      next();
    } catch (error) {
      next();
    }
  },

  requireOwnership: (resourceModel, resourceIdParam = 'id') => {
    return async (req, res, next) => {
      try {
        const resourceId = req.params[resourceIdParam];
        const resource = await resourceModel.findById(resourceId);

        if (!resource) {
          return res.status(404).json({ message: 'Resource not found.' });
        }

        if (resource.createdBy && resource.createdBy.toString() !== req.userId) {
          if (req.user.role !== 'admin') {
            return res.status(403).json({
              message: 'Access denied. You can only access your own resources.'
            });
          }
        }

        req.resource = resource;
        next();
      } catch (error) {
        console.error('Ownership middleware error:', error);
        res.status(500).json({ message: 'Server error during ownership check.' });
      }
    };
  }
};

module.exports = authMiddleware;
