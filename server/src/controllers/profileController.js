const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `avatar-${req.userId}-${uniqueSuffix}${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const profileController = {
  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: user.toPublicJSON(),
        profileCompleteness: calculateProfileCompleteness(user)
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error while fetching profile' });
    }
  },

  // Update user profile information
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone, bio } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate phone number if provided
      if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }

      // Validate bio length
      if (bio && bio.length > 500) {
        return res.status(400).json({ message: 'Bio cannot exceed 500 characters' });
      }

      // Update profile fields
      if (firstName) user.firstName = firstName.trim();
      if (lastName) user.lastName = lastName.trim();
      if (firstName || lastName) {
        user.name = `${user.firstName} ${user.lastName}`;
      }
      
      if (phone !== undefined) user.profile.phone = phone ? phone.trim() : '';
      if (bio !== undefined) user.profile.bio = bio ? bio.trim() : '';

      // Check if profile is now completed
      user.profile.completed = isProfileComplete(user);

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: user.toPublicJSON(),
        profileCompleteness: calculateProfileCompleteness(user)
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  },

  // Upload profile avatar
  async uploadAvatar(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Delete old avatar if exists
      if (user.profile.avatar) {
        try {
          const oldAvatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.profile.avatar));
          await fs.unlink(oldAvatarPath);
        } catch (deleteError) {
          console.warn('Could not delete old avatar:', deleteError.message);
        }
      }

      // Save new avatar path
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      user.profile.avatar = avatarUrl;
      user.profile.completed = isProfileComplete(user);

      await user.save();

      res.json({
        message: 'Avatar uploaded successfully',
        avatarUrl,
        user: user.toPublicJSON(),
        profileCompleteness: calculateProfileCompleteness(user)
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({ message: 'Server error while uploading avatar' });
    }
  },

  // Delete profile avatar
  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.profile.avatar) {
        return res.status(400).json({ message: 'No avatar to delete' });
      }

      // Delete avatar file
      try {
        const avatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.profile.avatar));
        await fs.unlink(avatarPath);
      } catch (deleteError) {
        console.warn('Could not delete avatar file:', deleteError.message);
      }

      // Remove avatar from user profile
      user.profile.avatar = null;
      user.profile.completed = isProfileComplete(user);

      await user.save();

      res.json({
        message: 'Avatar deleted successfully',
        user: user.toPublicJSON(),
        profileCompleteness: calculateProfileCompleteness(user)
      });
    } catch (error) {
      console.error('Delete avatar error:', error);
      res.status(500).json({ message: 'Server error while deleting avatar' });
    }
  },

  // Complete profile setup (mandatory after first login)
  async completeProfile(req, res) {
    try {
      const { phone, bio } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.profile.completed) {
        return res.status(400).json({ message: 'Profile is already completed' });
      }

      // Validate required fields for profile completion
      if (!phone || !bio) {
        return res.status(400).json({ 
          message: 'Phone number and bio are required to complete profile' 
        });
      }

      // Validate phone number
      if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }

      // Validate bio length
      if (bio.length > 500) {
        return res.status(400).json({ message: 'Bio cannot exceed 500 characters' });
      }

      // Update profile
      user.profile.phone = phone.trim();
      user.profile.bio = bio.trim();
      user.profile.completed = true;

      await user.save();

      res.json({
        message: 'Profile completed successfully',
        user: user.toPublicJSON(),
        profileCompleteness: calculateProfileCompleteness(user)
      });
    } catch (error) {
      console.error('Complete profile error:', error);
      res.status(500).json({ message: 'Server error while completing profile' });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ 
          message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character' 
        });
      }

      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      res.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error while changing password' });
    }
  },

  // Get profile completeness status
  async getProfileStatus(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const completeness = calculateProfileCompleteness(user);

      res.json({
        isVerified: user.isVerified,
        profileCompleted: user.profile.completed,
        completeness,
        requiresCompletion: !user.profile.completed && user.isVerified
      });
    } catch (error) {
      console.error('Get profile status error:', error);
      res.status(500).json({ message: 'Server error while fetching profile status' });
    }
  }
};

// Helper function to check if profile is complete
function isProfileComplete(user) {
  return !!(
    user.firstName &&
    user.lastName &&
    user.email &&
    user.isVerified &&
    user.profile.phone &&
    user.profile.bio
  );
}

// Helper function to calculate profile completeness percentage
function calculateProfileCompleteness(user) {
  const fields = [
    { field: 'firstName', weight: 15, value: user.firstName },
    { field: 'lastName', weight: 15, value: user.lastName },
    { field: 'email', weight: 20, value: user.email },
    { field: 'isVerified', weight: 25, value: user.isVerified },
    { field: 'avatar', weight: 10, value: user.profile.avatar },
    { field: 'phone', weight: 10, value: user.profile.phone },
    { field: 'bio', weight: 5, value: user.profile.bio }
  ];

  let totalWeight = 0;
  let completedWeight = 0;

  fields.forEach(({ weight, value }) => {
    totalWeight += weight;
    if (value) {
      completedWeight += weight;
    }
  });

  const percentage = Math.round((completedWeight / totalWeight) * 100);
  
  return {
    percentage,
    completed: percentage === 100,
    missing: fields.filter(({ value }) => !value).map(({ field }) => field)
  };
}

// Export multer middleware for avatar upload
profileController.uploadMiddleware = upload.single('avatar');

module.exports = profileController;