const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');

// Rate limiting specifically for Google OAuth attempts
const googleAuthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 Google auth attempts per IP per window
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Enhanced security: Use IP + user agent for more specific limiting
  keyGenerator: (req) => {
    return `${req.ip}:${req.get('User-Agent') || 'unknown'}`;
  },
  // Skip rate limiting for successful authentications
  skipSuccessfulRequests: true,
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.warn(`Google auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// CSRF protection middleware for Google OAuth
const validateGoogleAuthCSRF = (req, res, next) => {
  const { csrfToken } = req.body;
  const headerCsrfToken = req.headers['x-csrf-token'];
  
  if (!csrfToken || !headerCsrfToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token required'
    });
  }
  
  if (csrfToken !== headerCsrfToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  // Validate CSRF token format (should be 64 hex characters)
  if (!/^[a-f0-9]{64}$/i.test(csrfToken)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token format'
    });
  }
  
  next();
};

// Origin validation middleware
const validateGoogleAuthOrigin = (req, res, next) => {
  const origin = req.headers.origin || req.body.origin;
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://localhost:3000'
  ].filter(Boolean);
  
  if (!origin) {
    return res.status(403).json({
      success: false,
      message: 'Origin header required'
    });
  }
  
  if (!allowedOrigins.includes(origin)) {
    console.warn(`Google auth blocked invalid origin: ${origin} from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'Invalid origin'
    });
  }
  
  next();
};

// Request validation middleware
const validateGoogleAuthRequest = (req, res, next) => {
  // Check Content-Type
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'Content-Type must be application/json'
    });
  }
  
  // Check required headers
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({
      success: false,
      message: 'Invalid request headers'
    });
  }
  
  // Validate request body structure
  const { idToken } = req.body;
  if (!idToken || typeof idToken !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Valid ID token required'
    });
  }
  
  // Basic JWT structure validation
  const jwtParts = idToken.split('.');
  if (jwtParts.length !== 3) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token structure'
    });
  }
  
  next();
};

// Google token pre-validation middleware
const preValidateGoogleToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    
    // Quick header validation without full verification
    const header = JSON.parse(Buffer.from(idToken.split('.')[0], 'base64').toString());
    
    // Validate algorithm
    if (header.alg !== 'RS256') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token algorithm'
      });
    }
    
    // Quick payload validation
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    
    // Validate basic claims exist
    const requiredClaims = ['iss', 'aud', 'exp', 'sub', 'email'];
    for (const claim of requiredClaims) {
      if (!payload[claim]) {
        return res.status(400).json({
          success: false,
          message: `Missing required claim: ${claim}`
        });
      }
    }
    
    // Validate issuer quickly
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token issuer'
      });
    }
    
    // Validate audience quickly
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token audience'
      });
    }
    
    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return res.status(400).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    // Store pre-validated payload for controller
    req.preValidatedPayload = payload;
    
    next();
  } catch (error) {
    console.error('Token pre-validation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid token format'
    });
  }
};

// Security headers middleware for Google OAuth
const setGoogleAuthSecurityHeaders = (req, res, next) => {
  // Enhanced security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // CSP for Google OAuth (if needed)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// Log Google authentication attempts for monitoring
const logGoogleAuthAttempt = (req, res, next) => {
  const startTime = Date.now();
  
  // Log attempt
  console.log(`Google auth attempt from IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const success = data.success || false;
    
    console.log(`Google auth ${success ? 'SUCCESS' : 'FAILED'} - IP: ${req.ip}, Duration: ${duration}ms`);
    
    if (!success) {
      console.warn(`Google auth failure reason: ${data.message}`);
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Combined middleware for Google OAuth security
const googleAuthSecurityMiddleware = [
  setGoogleAuthSecurityHeaders,
  logGoogleAuthAttempt,
  googleAuthRateLimit,
  validateGoogleAuthOrigin,
  validateGoogleAuthRequest,
  validateGoogleAuthCSRF,
  preValidateGoogleToken
];

module.exports = {
  googleAuthRateLimit,
  validateGoogleAuthCSRF,
  validateGoogleAuthOrigin,
  validateGoogleAuthRequest,
  preValidateGoogleToken,
  setGoogleAuthSecurityHeaders,
  logGoogleAuthAttempt,
  googleAuthSecurityMiddleware
};