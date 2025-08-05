# Environment Variables Setup Guide

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fullstackapp
MONGODB_USER=admin
MONGODB_PASSWORD=your_secure_password_here

# JWT Configuration (REQUIRED - Generate secure keys)
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
JWT_ISSUER=your-app-name
JWT_AUDIENCE=your-app-audience

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Client Configuration
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Redis Configuration (for caching/sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DESTINATION=uploads/

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
COOKIE_SECRET=your_cookie_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Feature Flags
FEATURE_EMAIL_VERIFICATION=true
FEATURE_SOCIAL_LOGIN=true
FEATURE_PAYMENT_PROCESSING=false
FEATURE_FILE_UPLOAD=true

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Security Notes:
1. **NEVER commit your `.env` file to version control**
2. Generate strong, unique secrets for JWT_SECRET and JWT_REFRESH_SECRET
3. Use app-specific passwords for email services
4. Rotate secrets regularly in production
5. Use environment-specific configurations 