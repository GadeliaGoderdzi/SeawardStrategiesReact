# 🚀 Complete User Signup System Setup Guide

## 📋 **Overview**

This guide will help you set up a complete, production-ready user signup system with:
- ✅ User registration with validation
- ✅ Email verification
- ✅ Secure authentication
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Protected routes

## 🔧 **Step 1: Environment Setup (CRITICAL)**

### **1.1 Create Environment File**

**Create a file called `.env` in the `server/` directory:**

```bash
# Navigate to server directory
cd C:\Users\2024\Desktop\n8nWebDev\server

# Create .env file
New-Item -Path ".env" -ItemType File
```

### **1.2 Add Environment Variables**

**Open the `.env` file in Notepad and add this content:**

```bash
# Server Configuration
PORT=5000
HOST=localhost
NODE_ENV=development

# JWT Configuration (CRITICAL - Without this, registration fails)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_at_least_32_characters

# Frontend URL (CRITICAL - Without this, verification links fail)
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (for development - will use mock service)
EMAIL_FROM=noreply@fullstackapp.com

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
```

**Save the file and close Notepad.**

## 🧪 **Step 2: Test Environment Setup**

### **2.1 Run Environment Test**

```bash
# Make sure you're in the server directory
cd C:\Users\2024\Desktop\n8nWebDev\server

# Run the test script
node test-auth.js
```

**Expected Output:**
```
🔍 Testing Authentication System Setup...

1. Checking Environment Variables:
   ✅ JWT_SECRET: [SET]
   ✅ NODE_ENV: development
   ✅ FRONTEND_URL: http://localhost:3000
   ✅ CORS_ORIGIN: http://localhost:3000

2. Checking Data Directory:
   ✅ Data directory exists: C:\Users\2024\Desktop\n8nWebDev\server\data\users
   ✅ Users file exists: C:\Users\2024\Desktop\n8nWebDev\server\data\users\users.json (0 bytes)

3. Checking Required Dependencies:
   ✅ bcrypt: Available
   ✅ jsonwebtoken: Available
   ✅ crypto: Available
   ✅ nodemailer: Available

4. Checking Service Files:
   ✅ src/services/fileStorage.js: Exists
   ✅ src/services/emailService.js: Exists
   ✅ src/controllers/authController.js: Exists

📊 SUMMARY:
   ✅ Authentication system is properly configured!
   🚀 You can now test user registration.
```

**If you see any ❌ errors, fix them before proceeding.**

## 🚀 **Step 3: Start the Server**

### **3.1 Start Backend Server**

```bash
# Make sure you're in the server directory
cd C:\Users\2024\Desktop\n8nWebDev\server

# Start the server
npm run dev
```

**Expected Output:**
```
Loaded environment from .env
Server running on port 5000
Running in demo mode without database connection
```

### **3.2 Start Frontend (New Terminal)**

**Open a new PowerShell window and run:**

```bash
# Navigate to project root
cd C:\Users\2024\Desktop\n8nWebDev

# Start frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view n8nWebDev in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## 🧪 **Step 4: Test User Registration**

### **4.1 Open Registration Page**

1. **Open your browser**
2. **Go to:** `http://localhost:3000/signup`
3. **You should see the registration form**

### **4.2 Fill Out Registration Form**

**Use this test data:**
- **First Name:** `Test`
- **Last Name:** `User`
- **Email:** `test@example.com`
- **Password:** `TestPass123!`
- **Confirm Password:** `TestPass123!`

### **4.3 Submit the Form**

1. **Click "Create Account"**
2. **Watch the server console** for verification email logs
3. **You should see:**

```
=== EMAIL VERIFICATION ===
To: test@example.com
Subject: Verify Your Naval Account - Action Required
Verification Link: http://localhost:3000/verify-email?token=abc123...
========================
```

### **4.4 Complete Email Verification**

1. **Copy the verification link** from the server console
2. **Paste it in your browser**
3. **You should be automatically logged in**
4. **Redirected to the dashboard/profile page**

## 🔍 **Step 5: Troubleshooting Common Issues**

### **Issue 1: "JWT_SECRET is not defined"**

**Solution:**
```bash
# Check if .env file exists
dir .env

# If it doesn't exist, create it again
New-Item -Path ".env" -ItemType File
notepad .env
```

### **Issue 2: "CORS error"**

**Solution:**
```bash
# Make sure CORS_ORIGIN is set in .env
# Check the .env file content
type .env
```

### **Issue 3: "Email verification failed"**

**Solution:**
- The system uses a mock email service in development
- Check the server console for verification links
- Copy and paste the link manually

### **Issue 4: "Server not starting"**

**Solution:**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <PID> /F

# Restart server
npm run dev
```

### **Issue 5: "Frontend not loading"**

**Solution:**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID> /F

# Restart frontend
npm start
```

## 📧 **Step 6: Email Service Setup (Optional)**

### **6.1 For Real Email Sending (Production)**

**Option A: Gmail**
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Add to `.env`:
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Option B: Mailtrap (Testing)**
1. Sign up at mailtrap.io
2. Get SMTP credentials
3. Add to `.env`:
```bash
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-user
MAILTRAP_PASS=your-mailtrap-pass
```

### **6.2 For Development (Current Setup)**

The current setup uses a **mock email service** that:
- ✅ Logs verification links to console
- ✅ Perfect for testing
- ✅ No email setup required
- ✅ Shows exact verification URLs

## 🔒 **Step 7: Security Features**

### **7.1 Password Requirements**

Your system enforces:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number
- ✅ At least one special character

### **7.2 Security Headers**

The system includes:
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ XSS protection
- ✅ JWT token security

## 🧪 **Step 8: Testing Complete Flow**

### **8.1 Test Registration Flow**

1. **Go to:** `http://localhost:3000/signup`
2. **Register a new user**
3. **Check server console for verification email**
4. **Click verification link**
5. **Verify you're logged in**

### **8.2 Test Login Flow**

1. **Go to:** `http://localhost:3000/login`
2. **Login with your credentials**
3. **Verify you're redirected to dashboard**

### **8.3 Test Protected Routes**

1. **Try accessing:** `http://localhost:3000/dashboard`
2. **If not logged in, you should be redirected to login**
3. **After login, you should access the dashboard**

### **8.4 Test Logout**

1. **Go to dashboard/profile**
2. **Click logout**
3. **Verify you're logged out**

## 📊 **Step 9: Monitoring & Debugging**

### **9.1 Server Logs**

**Watch server console for:**
```
Registration request received: { body: {...}, headers: {...} }
Checking for existing user with email: test@example.com
Hashing password...
Creating user in file storage...
User created successfully: { id: '...', email: 'test@example.com' }
Attempting to send verification email...
Verification email sent successfully
Registration completed successfully
```

### **9.2 Browser Console**

**Press F12 and check:**
- Network tab for API requests
- Console tab for JavaScript errors
- Application tab for stored tokens

### **9.3 User Data Storage**

**Check user data:**
```bash
# View stored users
type data\users\users.json
```

## 🚀 **Step 10: Production Deployment**

### **10.1 For Hostinger Deployment**

1. **Follow the deployment guide:** `DEPLOYMENT_HOSTINGER_GUIDE.md`
2. **Use production environment variables**
3. **Set up real email service**
4. **Configure domain and SSL**

### **10.2 For Local Production Testing**

```bash
# Build frontend for production
cd client
npm run build

# Start server in production mode
cd ../server
set NODE_ENV=production
npm start
```

## ✅ **Success Checklist**

When everything is working correctly, you should see:

- ✅ **Server starts without errors**
- ✅ **Frontend loads at localhost:3000**
- ✅ **Registration form is accessible**
- ✅ **Form validation works**
- ✅ **User registration succeeds**
- ✅ **Verification email logs appear in console**
- ✅ **Email verification link works**
- ✅ **User is logged in after verification**
- ✅ **Protected routes work**
- ✅ **Login/logout functionality works**
- ✅ **User data is stored in JSON file**

## 🆘 **Getting Help**

### **If Something Doesn't Work:**

1. **Check the troubleshooting section above**
2. **Review server console for error messages**
3. **Check browser console for JavaScript errors**
4. **Verify all environment variables are set**
5. **Ensure both frontend and backend are running**

### **Common Error Messages:**

- **"JWT_SECRET is not defined"** → Check .env file
- **"CORS error"** → Check CORS_ORIGIN in .env
- **"Port already in use"** → Kill existing processes
- **"Module not found"** → Run `npm install`

## 🎉 **Congratulations!**

Your user signup system is now fully functional with:
- ✅ Secure user registration
- ✅ Email verification
- ✅ JWT authentication
- ✅ Protected routes
- ✅ User profile management
- ✅ Production-ready configuration

**Your application is ready for users to register and login!** 