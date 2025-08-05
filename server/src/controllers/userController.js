const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateEmail, validateName, validatePassword } = require('../utils/validators');

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: user.toPublicJSON()
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error while fetching profile' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { firstName, lastName, email, currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If updating password
      if (currentPassword && newPassword) {
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate new password (assuming validatePassword returns boolean)
        if (newPassword.length < 8) {
          return res.status(400).json({ 
            message: 'Password must be at least 8 characters long' 
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
      }

      // If updating profile information
      if (firstName !== undefined) {
        if (firstName.length < 2) {
          return res.status(400).json({ message: 'First name must be at least 2 characters long' });
        }
        user.firstName = firstName;
      }

      if (lastName !== undefined) {
        if (lastName.length < 2) {
          return res.status(400).json({ message: 'Last name must be at least 2 characters long' });
        }
        user.lastName = lastName;
      }

      if (firstName || lastName) {
        user.name = `${user.firstName} ${user.lastName}`;
      }

      if (email !== undefined) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Check if email already exists (but not for current user)
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: req.userId }
        });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use by another account' });
        }

        user.email = email.toLowerCase();
      }

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: user.toPublicJSON()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      res.status(500).json({ message: 'Server error updating profile' });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error while changing password' });
    }
  },

  async deleteAccount(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await User.findByIdAndDelete(userId);

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Server error while deleting account' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.json({
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        })),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Server error while fetching users' });
    }
  },

  async addProductSubscription(req, res) {
    try {
      const { productName, tier } = req.body;

      // Validation
      if (!productName || !tier) {
        return res.status(400).json({ message: 'Product name and tier are required' });
      }

      const validTiers = ['basic', 'premium', 'enterprise'];
      if (!validTiers.includes(tier.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid subscription tier' });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user already has this product
      const existingProduct = user.products.find(p => p.name === productName);
      if (existingProduct) {
        return res.status(400).json({ message: 'You are already subscribed to this product' });
      }

      // Add product to user's subscriptions
      user.products.push({
        name: productName,
        tier: tier.toLowerCase(),
        signupDate: new Date(),
        status: 'active'
      });

      await user.save();

      res.status(201).json({
        message: 'Product subscription added successfully',
        product: {
          name: productName,
          tier: tier.toLowerCase(),
          signupDate: new Date()
        },
        user: user.toPublicJSON()
      });
    } catch (error) {
      console.error('Add product subscription error:', error);
      res.status(500).json({ message: 'Server error adding product subscription' });
    }
  }
};

module.exports = userController;
