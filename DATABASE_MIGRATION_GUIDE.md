# Database Migration Guide

## Current Issue
The application is using file-based JSON storage (`server/src/services/fileStorage.js`) which is:
- Not scalable
- Not secure
- Not suitable for production
- Missing proper data validation

## Migration Steps

### 1. Enable MongoDB in Environment
Update your `.env` file to include proper MongoDB configuration:
```env
MONGODB_URI=mongodb://localhost:27017/fullstackapp
MONGODB_USER=admin
MONGODB_PASSWORD=your_secure_password
```

### 2. Update Server Configuration
The server already has MongoDB configuration in `server/src/config/environment.js`, but it's not being used.

### 3. Replace File Storage with MongoDB Models
The User model exists in `server/src/models/User.js` but isn't being used in the auth controller.

### 4. Update Auth Controller
Replace fileStorage calls with MongoDB User model calls in `server/src/controllers/authController.js`.

### 5. Data Migration Script
Create a script to migrate existing JSON data to MongoDB.

## Immediate Actions Needed:

1. **Update authController.js** to use MongoDB User model instead of fileStorage
2. **Remove fileStorage.js** dependency
3. **Implement proper data validation** using Mongoose schemas
4. **Add database connection error handling**
5. **Implement data migration scripts**

## Benefits of Migration:
- ✅ Proper data persistence
- ✅ Scalability
- ✅ Data validation
- ✅ Query optimization
- ✅ Backup and recovery
- ✅ Security improvements 