# Production Environment Setup for Hostinger

## 📋 **Production Environment Variables**

Create a `.env` file in the `server/` directory with these production values:

```bash
# Production Environment Variables for Hostinger Deployment

# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration (if using MongoDB)
# MONGODB_URI=mongodb://localhost:27017/fullstackapp
# For production, consider using MongoDB Atlas or similar cloud service

# JWT Configuration (CRITICAL - Generate a strong secret)
JWT_SECRET=your_super_secure_production_jwt_secret_key_here_make_it_very_long_and_random_at_least_64_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_here_make_it_different_from_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (your actual domain)
FRONTEND_URL=https://yourdomain.com
CLIENT_URL=https://yourdomain.com

# CORS Configuration (your actual domain)
CORS_ORIGIN=https://yourdomain.com

# Email Configuration (for production)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Alternative: Mailtrap for testing
# MAILTRAP_HOST=smtp.mailtrap.io
# MAILTRAP_PORT=2525
# MAILTRAP_USER=your-mailtrap-user
# MAILTRAP_PASS=your-mailtrap-pass

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DESTINATION=uploads/

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Payment Configuration (if using Stripe)
# STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
# STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OAuth Configuration (if using social login)
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# FACEBOOK_APP_ID=your_facebook_app_id
# FACEBOOK_APP_SECRET=your_facebook_app_secret

# Redis Configuration (optional, for caching)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_DB=0
```

## 🔑 **Generate Secure JWT Secrets**

Use these commands to generate secure JWT secrets:

```bash
# Generate JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📧 **Email Setup for Production**

### **Option 1: Gmail (Recommended)**

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in EMAIL_PASSWORD

### **Option 2: Mailtrap (For Testing)**

1. Sign up at mailtrap.io
2. Get your SMTP credentials
3. Use the Mailtrap variables instead of Gmail

### **Option 3: Other Email Services**

- **SendGrid**: Use SMTP settings
- **AWS SES**: Use AWS credentials
- **Mailgun**: Use Mailgun SMTP settings

## 🌐 **Domain Configuration**

Replace `yourdomain.com` with your actual domain:

```bash
FRONTEND_URL=https://yourdomain.com
CLIENT_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

## 🔒 **Security Checklist**

- [ ] JWT_SECRET is at least 64 characters long
- [ ] JWT_REFRESH_SECRET is different from JWT_SECRET
- [ ] Email password is an app password (not your regular password)
- [ ] CORS_ORIGIN matches your exact domain
- [ ] NODE_ENV is set to 'production'
- [ ] All sensitive data is properly secured

## 🚀 **Deployment Steps**

1. **Create the .env file** with the template above
2. **Update all placeholder values** with your actual data
3. **Upload to your Hostinger server**
4. **Run the deployment script**: `./deploy.sh`
5. **Test the application** at your domain

## ⚠️ **Important Notes**

- **Never commit .env files** to version control
- **Use different secrets** for development and production
- **Regularly rotate** your JWT secrets
- **Monitor logs** for any security issues
- **Keep backups** of your environment configuration 