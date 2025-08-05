const path = require('path');

const dotenv = require('dotenv');

const loadEnvironment = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFiles = [
    `.env.${nodeEnv}.local`,
    `.env.${nodeEnv}`,
    '.env.local',
    '.env'
  ];

  envFiles.forEach(file => {
    const envPath = path.resolve(process.cwd(), file);
    try {
      dotenv.config({ path: envPath });
      console.log(`Loaded environment from ${file}`);
    } catch (error) {
      // File doesn't exist, continue to next
    }
  });
};

loadEnvironment();

const config = {
  // Server Configuration
  port: parseInt(process.env.PORT) || 5000,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstackapp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Email Configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@fullstackapp.com'
  },

  // Payment Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },

  // File Upload Configuration
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/gif').split(','),
    destination: process.env.UPLOAD_DESTINATION || 'uploads/'
  },

  // Redis Configuration (for caching/sessions)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // limit each IP to 100 requests per windowMs
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Client Configuration
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:3000',
    resetPasswordUrl: process.env.CLIENT_RESET_PASSWORD_URL || 'http://localhost:3000/reset-password'
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
  },

  // External APIs
  apis: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET
    }
  },

  // Feature Flags
  features: {
    emailVerification: process.env.FEATURE_EMAIL_VERIFICATION === 'true',
    socialLogin: process.env.FEATURE_SOCIAL_LOGIN === 'true',
    paymentProcessing: process.env.FEATURE_PAYMENT_PROCESSING === 'true',
    fileUpload: process.env.FEATURE_FILE_UPLOAD === 'true'
  }
};

const validateConfig = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0 && config.nodeEnv === 'production') {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  if (missingVars.length > 0 && config.nodeEnv !== 'production') {
    console.warn(`Missing environment variables (using defaults): ${missingVars.join(', ')}`);
  }
};

const isDevelopment = () => config.nodeEnv === 'development';
const isProduction = () => config.nodeEnv === 'production';
const isTest = () => config.nodeEnv === 'test';

validateConfig();

module.exports = {
  config,
  isDevelopment,
  isProduction,
  isTest,
  validateConfig
};
