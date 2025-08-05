const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Use MongoDB for user storage
const User = require('../models/User');
const emailService = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const authController = {
  async register(req, res) {
    try {
      console.log('Registration request received:', { 
        body: { ...req.body, password: '[HIDDEN]' },
        headers: req.headers 
      });

      const { firstName, lastName, email, password, confirmPassword } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        console.log('Validation failed: Passwords do not match');
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        console.log('Validation failed: Password does not meet strength requirements');
        return res.status(400).json({ 
          message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character' 
        });
      }

      console.log('Checking for existing user with email:', email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Registration failed: User already exists');
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Check if JWT_SECRET is available
      if (!process.env.JWT_SECRET) {
        console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ 
          message: 'Server configuration error. Please contact administrator.',
          error: 'JWT_SECRET_MISSING'
        });
      }

      // Generate verification token
      console.log('Generating verification token...');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      console.log('Creating user in MongoDB...');
      const user = new User({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        authProvider: 'local',
        isVerified: false,
        verificationToken,
        verificationExpires,
        role: 'user',
        isActive: true,
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true
          }
        },
        profile: {
          completed: false
        },
        products: []
      });

      await user.save();
      console.log('User created successfully:', { id: user._id, email: user.email });

      // Send verification email
      try {
        console.log('Attempting to send verification email...');
        await emailService.sendVerificationEmail(user, verificationToken);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail registration if email fails
        console.log('Continuing with registration despite email failure');
      }

      console.log('Registration completed successfully');
      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account',
        requiresVerification: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      res.status(500).json({ 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email before logging in',
          requiresVerification: true,
          email: user.email
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const tokenExpiry = rememberMe ? '30d' : '7d';
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          profile: user.profile,
          preferences: user.preferences,
          products: user.products,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  async logout(req, res) {
    try {
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error during logout' });
    }
  },

  async verifyToken(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          profile: user.profile,
          preferences: user.preferences
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Server error during token verification' });
    }
  },

  async refreshToken(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ message: 'Server error during token refresh' });
    }
  },

  async googleAuth(req, res) {
    try {
      const { idToken, csrfToken, origin } = req.body;
      
      // Enhanced security: Validate request structure
      if (!idToken || !csrfToken) {
        return res.status(400).json({ 
          message: 'Missing required parameters',
          success: false 
        });
      }

      // Enhanced security: Validate CSRF token
      const sessionCsrfToken = req.headers['x-csrf-token'];
      if (!sessionCsrfToken || sessionCsrfToken !== csrfToken) {
        return res.status(403).json({ 
          message: 'Invalid CSRF token',
          success: false 
        });
      }

      // Enhanced security: Validate origin
      const allowedOrigins = [
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL,
        'http://localhost:3000', // Development only
        'https://localhost:3000'  // Development with HTTPS
      ].filter(Boolean);

      if (origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ 
          message: 'Invalid origin',
          success: false 
        });
      }

      // Enhanced security: Validate X-Requested-With header (CSRF protection)
      if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
        return res.status(403).json({ 
          message: 'Invalid request headers',
          success: false 
        });
      }

      // Load Google OAuth2Client
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      // Enhanced security: Comprehensive token verification
      let payload;
      try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
          // Enhanced security: Additional verification options
          maxExpiry: 3600, // 1 hour max
        });
        
        payload = ticket.getPayload();
      } catch (verificationError) {
        console.error('Google token verification failed:', verificationError);
        return res.status(401).json({ 
          message: 'Invalid Google token',
          success: false,
          error: verificationError.message
        });
      }

      // Enhanced security: Additional payload validation
      if (!payload) {
        return res.status(401).json({ 
          message: 'Invalid token payload',
          success: false 
        });
      }

      // Enhanced security: Validate required claims
      const requiredClaims = ['sub', 'email', 'email_verified', 'name'];
      for (const claim of requiredClaims) {
        if (!payload[claim]) {
          return res.status(401).json({ 
            message: `Missing required claim: ${claim}`,
            success: false 
          });
        }
      }

      // Enhanced security: Validate email verification
      if (!payload.email_verified) {
        return res.status(401).json({ 
          message: 'Google email not verified',
          success: false 
        });
      }

      // Enhanced security: Validate issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (!validIssuers.includes(payload.iss)) {
        return res.status(401).json({ 
          message: 'Invalid token issuer',
          success: false 
        });
      }

      // Enhanced security: Validate audience
      if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ 
          message: 'Invalid token audience',
          success: false 
        });
      }

      // Enhanced security: Check token freshness (issued within last hour)
      const now = Math.floor(Date.now() / 1000);
      if (payload.iat && (now - payload.iat) > 3600) {
        return res.status(401).json({ 
          message: 'Token too old',
          success: false 
        });
      }

      // Enhanced security: Rate limiting check (implement with Redis in production)
      const rateLimitKey = `google_auth:${payload.sub}:${req.ip}`;
      // TODO: Implement rate limiting logic here

      // Extract user data from verified payload
      const {
        sub: googleId,
        email,
        name,
        given_name,
        family_name,
        picture,
        locale,
        hd // Hosted domain for GSuite accounts
      } = payload;

      // Enhanced security: Check for existing user by both email and Google ID
      let user = await User.findOne({ 
        $or: [
          { email: email },
          { googleId: googleId }
        ]
      });

      const currentTime = new Date();

      if (user) {
        // Update existing user with enhanced security
        const updates = {
          googleId: googleId,
          profilePicture: picture,
          lastLogin: currentTime,
          locale: locale
        };

        // Enhanced security: Only update email if it matches or user doesn't have one
        if (!user.email || user.email === email) {
          updates.email = email;
        } else if (user.email !== email) {
          // Enhanced security: Email mismatch - require manual verification
          return res.status(409).json({ 
            message: 'Email address mismatch with existing account',
            success: false,
            requiresManualVerification: true
          });
        }

        // Enhanced security: Update GSuite domain if applicable
        if (hd) {
          updates.gsuiteDomain = hd;
        }

        Object.assign(user, updates);
        await user.save();

        // Enhanced security: Log successful login
        console.log(`Google auth success - existing user: ${user.email} (${user._id})`);

      } else {
        // Create new user with enhanced security
        const newUserData = {
          firstName: given_name || name.split(' ')[0] || 'User',
          lastName: family_name || name.split(' ').slice(1).join(' ') || '',
          name: name || 'Google User',
          email: email,
          googleId: googleId,
          profilePicture: picture,
          authProvider: 'google',
          isVerified: true, // Google emails are pre-verified
          locale: locale,
          lastLogin: currentTime,
          createdAt: currentTime
        };

        // Enhanced security: Add GSuite domain if applicable
        if (hd) {
          newUserData.gsuiteDomain = hd;
        }

        user = new User(newUserData);
        await user.save();

        // Enhanced security: Log new user creation
        console.log(`Google auth success - new user created: ${user.email} (${user._id})`);
      }

      // Enhanced security: Generate secure JWT with additional claims
      const jwtToken = jwt.sign(
        { 
          userId: user._id,
          authProvider: 'google',
          googleId: googleId,
          sessionId: crypto.randomBytes(16).toString('hex') // Session tracking
        }, 
        process.env.JWT_SECRET, 
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
          issuer: process.env.JWT_ISSUER || 'seaward-strategies',
          audience: process.env.JWT_AUDIENCE || 'seaward-app'
        }
      );

      // Enhanced security: Prepare response data
      const responseData = {
        success: true,
        message: 'Google authentication successful',
        token: jwtToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
          locale: user.locale,
          gsuiteDomain: user.gsuiteDomain
        },
        sessionInfo: {
          loginTime: currentTime,
          provider: 'google',
          // Don't include sensitive session info in response
        }
      };

      // Enhanced security: Set secure HTTP-only cookie option
      if (process.env.NODE_ENV === 'production') {
        res.cookie('auth_session', jwtToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      }

      res.json(responseData);

    } catch (error) {
      console.error('Google auth error:', error);
      
      // Enhanced security: Sanitize error messages for production
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorMessage = isDevelopment 
        ? `Server error during Google authentication: ${error.message}`
        : 'Authentication failed. Please try again.';

      res.status(500).json({ 
        message: errorMessage,
        success: false,
        ...(isDevelopment && { stack: error.stack })
      });
    }
  },

  async facebookAuth(req, res) {
    try {
      const { token, userData } = req.body;
      
      // Here you would verify the Facebook token
      // For now, we'll create/find user based on the provided data
      const { email, name, first_name, last_name, picture } = userData;
      
      let user = await User.findOne({ 
        $or: [
          { email },
          { facebookId: userData.id }
        ]
      });

      if (user) {
        // Update existing user
        user.facebookId = userData.id;
        user.profilePicture = picture?.data?.url;
        await user.save();
      } else {
        // Create new user
        user = new User({
          firstName: first_name || name.split(' ')[0],
          lastName: last_name || name.split(' ').slice(1).join(' '),
          name,
          email,
          facebookId: userData.id,
          profilePicture: picture?.data?.url,
          authProvider: 'facebook',
          isVerified: true
        });
        await user.save();
      }

      const jwtToken = generateToken(user._id);

      res.json({
        message: 'Facebook authentication successful',
        token: jwtToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      });
    } catch (error) {
      console.error('Facebook auth error:', error);
      res.status(500).json({ message: 'Server error during Facebook authentication' });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }

      // Verify and decode the token
      let decoded;
      try {
        decoded = emailService.verifyToken(token);
      } catch (error) {
        if (error.message === 'EXPIRED_TOKEN') {
          return res.status(400).json({ 
            message: 'Verification token has expired',
            expired: true 
          });
        } else if (error.message === 'INVALID_TOKEN') {
          return res.status(400).json({ 
            message: 'Invalid verification token',
            invalid: true 
          });
        }
        throw error;
      }

      // Find user with this token
      const user = await User.findOne({ 
        email: decoded.userId,
        verificationToken: token,
        verificationExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({ 
          message: 'Invalid or expired verification token',
          expired: true 
        });
      }

      if (user.isVerified) {
        return res.status(400).json({ 
          message: 'Email is already verified',
          alreadyVerified: true 
        });
      }

      // Verify the user
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationExpires = undefined;
      await user.save();

      // Generate login token
      const loginToken = generateToken(user._id);

      res.json({
        message: 'Email verified successfully! You are now logged in.',
        success: true,
        token: loginToken,
        user: user.toPublicJSON()
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Server error during email verification' });
    }
  },

  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ 
          message: 'Email is already verified',
          alreadyVerified: true 
        });
      }

      // Generate new verification token
      const verificationToken = emailService.generateVerificationToken(user.email);
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.verificationToken = verificationToken;
      user.verificationExpires = verificationExpires;
      await user.save();

      // Send verification email
      try {
        await emailService.sendVerificationEmail(user, verificationToken);
        res.json({
          message: 'Verification email sent successfully! Please check your inbox.',
          success: true
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        res.status(500).json({ message: 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ message: 'Server error during resend verification' });
    }
  },

  async checkEmail(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const existingUser = await User.findOne({ email });
      
      res.json({
        exists: !!existingUser,
        verified: existingUser ? existingUser.isVerified : false
      });
    } catch (error) {
      console.error('Email check error:', error);
      res.status(500).json({ message: 'Server error during email check' });
    }
  }
};

module.exports = authController;
