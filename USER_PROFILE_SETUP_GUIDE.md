# 🚀 Complete User Profile System Setup Guide

## 📋 **Overview**

Your user profile system includes:
- ✅ User profile dashboard with edit capabilities
- ✅ Profile completion workflow
- ✅ Password change functionality
- ✅ Avatar upload system
- ✅ Profile status tracking
- ✅ Protected routes and authentication

## 🔧 **Step 1: Verify Backend Setup**

### **1.1 Check Profile Routes**

Your profile routes are already configured in `server/src/routes/api.js`:

```javascript
// Enhanced profile routes
router.use('/profile', profileRoutes);
```

### **1.2 Verify Profile Controller**

The profile controller (`server/src/controllers/profileController.js`) includes:
- ✅ Get user profile
- ✅ Update profile information
- ✅ Complete profile setup
- ✅ Upload avatar
- ✅ Change password
- ✅ Profile status tracking

### **1.3 Check Authentication Middleware**

Profile routes use authentication middleware:
```javascript
// All profile routes require authentication
router.use(authMiddleware.authenticate);
```

## 🚀 **Step 2: Test Profile System**

### **2.1 Start Your Application**

**Terminal 1 - Backend:**
```bash
cd C:\Users\2024\Desktop\n8nWebDev\server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\2024\Desktop\n8nWebDev
npm start
```

### **2.2 Register a Test User**

1. **Go to:** `http://localhost:3000/signup`
2. **Register with:**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
3. **Complete email verification** (check server console for link)

### **2.3 Access Profile Dashboard**

1. **After verification, you'll be redirected to:** `http://localhost:3000/dashboard`
2. **Or manually go to:** `http://localhost:3000/profile`

## 🧪 **Step 3: Test Profile Features**

### **3.1 Profile Dashboard Features**

**What you should see:**
- ✅ Welcome message with user's name
- ✅ User information card (name, email)
- ✅ Edit profile button
- ✅ Change password section
- ✅ Logout functionality

### **3.2 Test Profile Editing**

1. **Click "Edit" button** on User Information card
2. **Update fields:**
   - First Name: `Updated`
   - Last Name: `Name`
   - Email: `updated@example.com`
3. **Click "Save Changes"**
4. **Verify changes are saved**

### **3.3 Test Password Change**

1. **Click "Edit" button** on Password section
2. **Enter:**
   - Current Password: `TestPass123!`
   - New Password: `NewPass123!`
   - Confirm Password: `NewPass123!`
3. **Click "Save Changes"**
4. **Test login with new password**

### **3.4 Test Profile Completion**

If your profile is incomplete:
1. **Go to:** `http://localhost:3000/complete-profile`
2. **Fill required fields:**
   - Phone: `+1234567890`
   - Bio: `Maritime professional with 5+ years experience`
3. **Upload avatar (optional)**
4. **Complete profile**

## 🔍 **Step 4: API Endpoints Testing**

### **4.1 Test Profile API Endpoints**

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Profile:**
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "email": "updated@example.com"
  }'
```

**Change Password:**
```bash
curl -X PUT http://localhost:5000/api/profile/password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "TestPass123!",
    "newPassword": "NewPass123!"
  }'
```

### **4.2 Get JWT Token**

To get your JWT token:
1. **Open browser console** (F12)
2. **Go to Application tab**
3. **Check Local Storage**
4. **Copy the "token" value**

## 🔒 **Step 5: Security Features**

### **5.1 Authentication Protection**

- ✅ All profile routes require valid JWT token
- ✅ Token expiration handling
- ✅ Rate limiting on profile endpoints
- ✅ Input validation and sanitization

### **5.2 Password Security**

- ✅ Current password verification
- ✅ Password strength validation
- ✅ Secure password hashing
- ✅ Password change confirmation

### **5.3 Data Validation**

- ✅ Email format validation
- ✅ Name length validation
- ✅ Phone number format validation
- ✅ Bio length limits

## 🐛 **Step 6: Troubleshooting**

### **Issue 1: "Profile not loading"**

**Check:**
```bash
# Verify server is running
curl http://localhost:5000/api/status

# Check authentication
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Issue 2: "Cannot edit profile"**

**Solutions:**
1. **Check if user is logged in**
2. **Verify JWT token is valid**
3. **Check browser console for errors**
4. **Ensure all required fields are filled**

### **Issue 3: "Password change failed"**

**Check:**
1. **Current password is correct**
2. **New password meets requirements**
3. **Passwords match**
4. **Server logs for errors**

### **Issue 4: "Avatar upload not working"**

**Solutions:**
1. **Check file size (max 5MB)**
2. **Verify file type (images only)**
3. **Check upload directory permissions**
4. **Review server logs**

## 📊 **Step 7: Profile System Features**

### **7.1 User Profile Dashboard**

**Features:**
- ✅ Display user information
- ✅ Edit profile data
- ✅ Change password
- ✅ View profile completeness
- ✅ Logout functionality

### **7.2 Profile Completion**

**Required fields:**
- ✅ Phone number
- ✅ Bio (10-500 characters)
- ✅ Avatar (optional)

### **7.3 Profile Status Tracking**

**Tracks:**
- ✅ Profile completeness percentage
- ✅ Required fields status
- ✅ Verification status
- ✅ Last update timestamp

## 🧪 **Step 8: Complete Testing Flow**

### **8.1 Full User Journey Test**

1. **Register new user** → `http://localhost:3000/signup`
2. **Verify email** → Check server console for link
3. **Access dashboard** → `http://localhost:3000/dashboard`
4. **Edit profile** → Update name and email
5. **Change password** → Test new password
6. **Complete profile** → Add phone and bio
7. **Test logout** → Verify logout works
8. **Test login** → Login with new credentials

### **8.2 API Testing**

**Test all endpoints:**
```bash
# Get profile
GET /api/profile

# Update profile
PUT /api/profile

# Change password
PUT /api/profile/password

# Complete profile
POST /api/profile/complete

# Upload avatar
POST /api/profile/avatar

# Get profile status
GET /api/profile/status
```

## ✅ **Step 9: Success Indicators**

When your profile system is working correctly:

- ✅ **Dashboard loads** with user information
- ✅ **Profile editing** works without errors
- ✅ **Password changes** are successful
- ✅ **Profile completion** tracks progress
- ✅ **Avatar upload** works (if configured)
- ✅ **Protected routes** redirect unauthenticated users
- ✅ **Logout** clears user session
- ✅ **API endpoints** return correct responses

## 🚀 **Step 10: Production Considerations**

### **10.1 File Upload Configuration**

For production avatar uploads:
```bash
# Add to your .env file
UPLOAD_DESTINATION=uploads/
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

### **10.2 Database Integration**

For production with MongoDB:
```bash
# Add to your .env file
MONGODB_URI=your_mongodb_connection_string
```

### **10.3 Email Configuration**

For production email notifications:
```bash
# Add to your .env file
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🆘 **Getting Help**

### **If Profile System Doesn't Work:**

1. **Check server console** for error messages
2. **Verify authentication** is working
3. **Test API endpoints** directly
4. **Check browser console** for JavaScript errors
5. **Verify environment variables** are set correctly

### **Common Error Messages:**

- **"User not found"** → Check authentication token
- **"Profile update failed"** → Verify input validation
- **"Password incorrect"** → Check current password
- **"Upload failed"** → Check file size and type

## 🎉 **Congratulations!**

Your user profile system is now fully functional with:
- ✅ Complete profile management
- ✅ Secure authentication
- ✅ Password change functionality
- ✅ Profile completion workflow
- ✅ Avatar upload system
- ✅ Protected routes
- ✅ Input validation
- ✅ Error handling

**Your users can now manage their profiles securely!** 