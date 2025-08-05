const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CASH: 'cash'
};

const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME: 'home',
  BOOKS: 'books',
  SPORTS: 'sports',
  TOYS: 'toys',
  HEALTH: 'health',
  AUTOMOTIVE: 'automotive',
  OTHER: 'other'
};

const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  PICKUP: 'pickup'
};

const EMAIL_TYPES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  ORDER_CONFIRMATION: 'order_confirmation',
  SHIPPING_UPDATE: 'shipping_update',
  CONTACT_FORM: 'contact_form'
};

const RATE_LIMITS = {
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5 // 5 attempts per 15 minutes
  },
  API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100 // 100 requests per 15 minutes
  },
  CONTACT: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 3 // 3 contact form submissions per hour
  }
};

const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  PRODUCT: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000
    }
  }
};

const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DESTINATIONS: {
    AVATARS: 'uploads/avatars/',
    PRODUCTS: 'uploads/products/',
    DOCUMENTS: 'uploads/documents/'
  }
};

const CACHE_KEYS = {
  USER_PROFILE: 'user:profile:',
  PRODUCT_LIST: 'products:list',
  PRODUCT_DETAIL: 'product:detail:',
  CATEGORIES: 'categories',
  STATS: 'stats'
};

const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  EXTRA_LONG: 24 * 60 * 60 // 24 hours
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Access denied. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'A user with this email already exists.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An internal server error occurred.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.'
};

const SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  ORDER_CREATED: 'Order placed successfully.',
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  EMAIL_SENT: 'Email sent successfully.'
};

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PRODUCT_CATEGORIES,
  SHIPPING_METHODS,
  EMAIL_TYPES,
  RATE_LIMITS,
  VALIDATION_RULES,
  FILE_UPLOAD,
  CACHE_KEYS,
  CACHE_TTL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENVIRONMENTS
};
