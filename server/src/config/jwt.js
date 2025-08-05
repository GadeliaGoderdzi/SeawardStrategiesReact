const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  refreshSecret: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  issuer: process.env.JWT_ISSUER || 'fullstack-app',
  audience: process.env.JWT_AUDIENCE || 'fullstack-app-users'
};

const generateToken = (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: jwtConfig.expiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience
  };

  const tokenOptions = { ...defaultOptions, ...options };

  return jwt.sign(payload, jwtConfig.secret, tokenOptions);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });
  } catch (error) {
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });
  } catch (error) {
    throw error;
  }
};

const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? decoded.exp : null;
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) return true;

    return Date.now() >= expiry * 1000;
  } catch (error) {
    return true;
  }
};

const generateTokenPair = (payload) => {
  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: jwtConfig.expiresIn
  };
};

const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
};

const createTokenResponse = (user, additionalData = {}) => {
  const payload = {
    userId: user._id || user.id,
    email: user.email,
    role: user.role
  };

  const tokens = generateTokenPair(payload);

  return {
    ...tokens,
    user: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    ...additionalData
  };
};

const validateJWTConfig = () => {
  const requiredFields = ['secret', 'refreshSecret'];
  const missingFields = requiredFields.filter(field => !jwtConfig[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing JWT configuration: ${missingFields.join(', ')}`);
  }

  if (jwtConfig.secret.length < 32) {
    console.warn('JWT secret should be at least 32 characters long for security');
  }

  if (jwtConfig.refreshSecret.length < 32) {
    console.warn('JWT refresh secret should be at least 32 characters long for security');
  }
};

if (process.env.NODE_ENV !== 'test') {
  validateJWTConfig();
}

module.exports = {
  jwtConfig,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiry,
  isTokenExpired,
  generateTokenPair,
  extractTokenFromHeader,
  createTokenResponse,
  validateJWTConfig
};
