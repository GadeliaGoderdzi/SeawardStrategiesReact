# Authentication System Guide

## 🚀 Complete Authentication Setup

Your full stack application now includes a comprehensive authentication system with the following features:

### ✅ **Email/Password Authentication**
- User registration with first name, last name, email, and password
- Secure password hashing with bcrypt
- JWT token-based authentication
- Form validation on both client and server side
- Password strength indicator
- Real-time field validation with visual feedback

### ✅ **OAuth Integration**
- **Google OAuth**: Sign in/up with Google accounts
- **Facebook OAuth**: Sign in/up with Facebook accounts
- Seamless user creation for OAuth users
- Profile picture integration from OAuth providers

### ✅ **Security Features**
- Password requirements: 8+ characters, uppercase, lowercase, number, special character
- JWT tokens with 7-day expiration
- Protected routes and middleware
- CORS configuration
- Rate limiting ready
- Input validation and sanitization

## 🛠️ **Setup Instructions**

### 1. **Database Setup**
Install and start MongoDB:
```bash
# Install MongoDB Community Edition
# For Windows: Download from https://www.mongodb.com/try/download/community
# For Mac: brew install mongodb/brew/mongodb-community
# For Ubuntu: sudo apt install mongodb

# Start MongoDB
mongod
```

### 2. **Environment Configuration**
Update your `.env` files with proper values:

**Server (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/fullstackapp
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_at_least_32_characters
```

**Client (.env):**
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
```

### 3. **OAuth Setup** (Optional)
Follow the detailed instructions in `OAUTH_SETUP.md` to configure Google and Facebook authentication.

### 4. **Start the Application**
```bash
npm run dev
```

## 📱 **Usage**

### **Registration Flow**
1. Navigate to `/signup`
2. Fill in first name, last name, email, and password
3. Password must meet strength requirements
4. Check "I agree to Terms of Service"
5. Submit form or use Google/Facebook signup

### **Login Flow**
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In" or use Google/Facebook login
4. Redirected to dashboard on success

### **Features**
- **Password Visibility**: Toggle password visibility with eye icon
- **Real-time Validation**: Fields show green checkmarks when valid
- **Error Handling**: Clear error messages for failed attempts
- **Loading States**: Buttons show loading state during requests
- **Responsive Design**: Works on mobile and desktop

## 🔧 **API Endpoints**

### Authentication Endpoints
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
GET  /api/auth/verify      - Verify JWT token
POST /api/auth/refresh     - Refresh JWT token
POST /api/auth/google      - Google OAuth authentication
POST /api/auth/facebook    - Facebook OAuth authentication
```

### Example Registration Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

### Example Response
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b31b12f8c8e8e8e",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

## 🔐 **Testing Authentication**

### Without MongoDB
The app includes graceful error handling if MongoDB is not running. You'll see connection errors in the console, but the frontend will still work for UI testing.

### With MongoDB
1. Ensure MongoDB is running
2. Test user registration at `/signup`
3. Test user login at `/login`
4. Check user persistence across page refreshes
5. Test logout functionality

### OAuth Testing
1. Configure OAuth credentials in environment variables
2. Test Google login (requires Google developer account)
3. Test Facebook login (requires Facebook developer account)
4. Without credentials, buttons show "not configured" message

## 🛡️ **Security Best Practices Implemented**

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Strong password requirements
   - No password storage in plain text

2. **JWT Security**
   - Secure random secrets
   - Reasonable expiration times
   - Httponly cookies option ready

3. **Input Validation**
   - Client-side validation for UX
   - Server-side validation for security
   - SQL injection protection with Mongoose

4. **CORS Configuration**
   - Restricted to specific origins
   - Secure headers with Helmet

## 🚨 **Troubleshooting**

### Common Issues

1. **MongoDB Connection Error**
   ```
   Database connection error: MongoParseError
   ```
   **Solution**: Install and start MongoDB, or use MongoDB Atlas cloud database

2. **JWT_SECRET Missing**
   ```
   Missing environment variables: JWT_SECRET
   ```
   **Solution**: Add JWT_SECRET to your `.env` file

3. **OAuth Not Working**
   ```
   Google/Facebook authentication failed
   ```
   **Solution**: Configure OAuth credentials in environment variables

4. **CORS Errors**
   ```
   Access to fetch blocked by CORS policy
   ```
   **Solution**: Ensure backend server is running on port 5000

### Development Mode
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## 📝 **Next Steps**

1. **Email Verification**: Add email verification for new users
2. **Password Reset**: Implement forgot password functionality
3. **Two-Factor Authentication**: Add 2FA support
4. **Session Management**: Add device management and session monitoring
5. **Social Profiles**: Extend OAuth to include more providers (GitHub, Twitter, etc.)

## 🎯 **Production Deployment**

Before deploying to production:

1. **Environment Variables**
   - Use strong, unique JWT secrets
   - Configure production MongoDB URI
   - Set up OAuth with production domains

2. **Security Headers**
   - Enable HTTPS
   - Configure security headers
   - Set up proper CORS origins

3. **Monitoring**
   - Set up logging and monitoring
   - Configure error tracking
   - Monitor authentication attempts

Your authentication system is now fully functional and ready for use! 🎉