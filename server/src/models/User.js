const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [25, 'First name cannot exceed 25 characters']
  },
  lastName: {
    type: String,
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [25, 'Last name cannot exceed 25 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long'],
    required: function() {
      return this.authProvider === 'local';
    }
  },
  // OAuth fields
  googleId: {
    type: String,
    sparse: true
  },
  facebookId: {
    type: String,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    sparse: true
  },
  verificationExpires: {
    type: Date
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    tier: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      required: true
    },
    signupDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'suspended'],
      default: 'active'
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    isVerified: this.isVerified,
    profile: this.profile,
    profileImage: this.profileImage,
    preferences: this.preferences,
    products: this.products,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('User', userSchema);
