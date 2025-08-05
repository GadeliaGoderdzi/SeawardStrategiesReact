# Environment Setup Guide - Fix Authentication Issues

## 🚨 **Critical Issue: Account Creation Not Working**

Your authentication system has several configuration issues that prevent account creation. Follow this guide to fix them.

## 📋 **Required Environment Variables**

Create a `.env` file in the `server/` directory with these variables:

```bash
# Server Configuration
PORT=5000
HOST=localhost
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fullstackapp

# JWT Configuration (CRITICAL - Without this, registration fails)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_at_least_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (for verification emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@fullstackapp.com

# Mailtrap Configuration (for development - RECOMMENDED)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-user
MAILTRAP_PASS=your-mailtrap-pass

# Frontend URL (CRITICAL - Without this, verification links fail)
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DESTINATION=uploads/

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Payment Configuration (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

## 🔧 **Quick Fix Steps**

### **Step 1: Create Minimal .env File**
Create `server/.env` with these **minimum required** variables:

```bash
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_at_least_32_characters
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### **Step 2: Test Email Service**
For development, the email service will use a mock transporter and log verification links to console. This is **perfect for testing**.

### **Step 3: Restart Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: "JWT_SECRET is not defined"**
**Solution**: Add JWT_SECRET to your .env file
```bash
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_at_least_32_characters
```

### **Issue 2: "Email verification failed"**
**Solution**: The system will log verification links to console in development mode. Check the server console for the verification link.

### **Issue 3: "CORS error"**
**Solution**: Add CORS_ORIGIN to your .env file
```bash
CORS_ORIGIN=http://localhost:3000
```

### **Issue 4: "File storage error"**
**Solution**: The server will create the data directory automatically. If it fails, manually create:
```bash
mkdir -p server/data/users
```

## 🧪 **Testing the Fix**

### **1. Start the Server**
```bash
cd server
npm run dev
```

### **2. Check Console Output**
You should see:
```
Loaded environment from .env
Server running on port 5000
Running in demo mode without database connection
```

### **3. Test Registration**
1. Go to `http://localhost:3000/signup`
2. Fill out the registration form
3. Submit the form
4. Check the server console for verification email logs

### **4. Expected Console Output**
```
=== EMAIL VERIFICATION ===
To: user@example.com
Subject: Verify Your Naval Account - Action Required
Verification Link: http://localhost:3000/verify-email?token=abc123...
========================
```

## 🔍 **Debugging Steps**

### **If Registration Still Fails:**

1. **Check Browser Console** (F12):
   - Look for network errors
   - Check for CORS errors
   - Look for JavaScript errors

2. **Check Server Console**:
   - Look for error messages
   - Check if JWT_SECRET is loaded
   - Check if email service is working

3. **Check Network Tab**:
   - Look for failed API requests
   - Check request/response data

4. **Test API Directly**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

## 📧 **Email Verification Setup (Optional)**

For production, set up a real email service:

### **Option 1: Mailtrap (Recommended for Development)**
1. Sign up at mailtrap.io
2. Get your SMTP credentials
3. Add to .env:
```bash
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-user
MAILTRAP_PASS=your-mailtrap-pass
```

### **Option 2: Gmail**
1. Enable 2-factor authentication
2. Generate app password
3. Add to .env:
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## ✅ **Success Indicators**

When working correctly, you should see:

1. ✅ Server starts without errors
2. ✅ Registration form submits successfully
3. ✅ Console shows verification email log
4. ✅ User is redirected to verification page
5. ✅ Verification link works and logs in user

## 🆘 **Still Having Issues?**

If the problem persists:

1. **Check file permissions** on server/data/users directory
2. **Verify all environment variables** are set correctly
3. **Clear browser cache** and try again
4. **Check for conflicting ports** (3000, 5000)
5. **Review server logs** for specific error messages

The most common issue is missing JWT_SECRET or CORS configuration. Start with the minimal .env file and add more variables as needed. 