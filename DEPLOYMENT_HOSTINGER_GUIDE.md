# 🚀 Deployment Guide: VNS Hostinger Server

## 📋 **Prerequisites**

Before deploying, ensure you have:
- ✅ VNS Hostinger hosting account
- ✅ Domain name (optional but recommended)
- ✅ Node.js hosting plan (not shared hosting)
- ✅ SSH access to your server
- ✅ Git repository of your project

## 🔧 **Step 1: Prepare Your Project for Production**

### **1.1 Update Environment Variables**

Create a production `.env` file in the `server/` directory:

```bash
# Production Environment Variables
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration (if using MongoDB)
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secure_production_jwt_secret_key_here_make_it_very_long_and_random
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (your domain)
FRONTEND_URL=https://yourdomain.com
CLIENT_URL=https://yourdomain.com

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Email Configuration (for production)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

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

### **1.2 Build the Frontend**

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `build/` folder with optimized production files.

### **1.3 Update Package.json Scripts**

Ensure your `server/package.json` has these scripts:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "build": "npm install",
    "postinstall": "npm run build"
  }
}
```

## 🌐 **Step 2: VNS Hostinger Server Setup**

### **2.1 Access Your Hostinger Control Panel**

1. Log in to your Hostinger control panel
2. Navigate to "Hosting" → "Manage"
3. Go to "Advanced" → "SSH Access"

### **2.2 Enable SSH Access**

1. Click "Enable SSH Access"
2. Set a strong password
3. Note down your SSH credentials:
   - Host: `your-server.hostinger.com`
   - Username: `u123456789` (your hosting username)
   - Port: `22`

### **2.3 Connect via SSH**

```bash
ssh u123456789@your-server.hostinger.com
```

## 📁 **Step 3: Server Environment Setup**

### **3.1 Install Node.js (if not available)**

```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, contact Hostinger support to enable Node.js
# Most Hostinger plans include Node.js by default
```

### **3.2 Create Project Directory**

```bash
# Navigate to your home directory
cd ~

# Create project directory
mkdir n8nWebDev
cd n8nWebDev

# Clone your repository (if using Git)
git clone https://github.com/yourusername/n8nWebDev.git .

# OR upload files manually via File Manager
```

### **3.3 Install Dependencies**

```bash
# Install server dependencies
cd server
npm install --production

# Install client dependencies and build
cd ../client
npm install
npm run build
```

## ⚙️ **Step 4: Configure the Application**

### **4.1 Set Environment Variables**

```bash
# Navigate to server directory
cd ~/n8nWebDev/server

# Create production .env file
nano .env
```

Paste your production environment variables and save.

### **4.2 Configure Process Manager (PM2)**

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add this content:

```javascript
module.exports = {
  apps: [{
    name: 'n8nWebDev',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### **4.3 Create Logs Directory**

```bash
mkdir -p logs
```

## 🚀 **Step 5: Start the Application**

### **5.1 Start with PM2**

```bash
# Navigate to server directory
cd ~/n8nWebDev/server

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

### **5.2 Verify Application is Running**

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs n8nWebDev

# Check if port is listening
netstat -tlnp | grep :5000
```

## 🌐 **Step 6: Domain Configuration**

### **6.1 Configure Domain in Hostinger**

1. Go to Hostinger control panel
2. Navigate to "Domains" → "Manage"
3. Add your domain or subdomain
4. Point it to your hosting account

### **6.2 Create .htaccess File**

Create `.htaccess` in your public_html directory:

```apache
RewriteEngine On

# Redirect all requests to your Node.js app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:5000/$1 [P,L]

# Handle static files
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:5000/$1 [P,L]
```

### **6.3 Alternative: Use Subdomain**

If you prefer a subdomain (e.g., `api.yourdomain.com`):

1. Create subdomain in Hostinger control panel
2. Point it to your Node.js application
3. Update CORS settings in your .env file

## 🔒 **Step 7: Security Configuration**

### **7.1 SSL Certificate**

1. In Hostinger control panel, go to "SSL"
2. Install SSL certificate for your domain
3. Force HTTPS redirect

### **7.2 Update CORS Settings**

Ensure your `.env` file has the correct CORS origin:

```bash
CORS_ORIGIN=https://yourdomain.com
```

### **7.3 Environment Variables Security**

```bash
# Make sure .env file is not accessible via web
chmod 600 .env

# Ensure logs directory is secure
chmod 755 logs
```

## 📊 **Step 8: Monitoring & Maintenance**

### **8.1 PM2 Monitoring**

```bash
# Monitor application
pm2 monit

# View logs
pm2 logs n8nWebDev

# Restart application
pm2 restart n8nWebDev

# Stop application
pm2 stop n8nWebDev
```

### **8.2 Application Health Check**

Your app includes a health check endpoint:
```
https://yourdomain.com/api/status
```

### **8.3 Log Management**

```bash
# View application logs
tail -f logs/app.log

# View PM2 logs
pm2 logs n8nWebDev --lines 100
```

## 🔄 **Step 9: Deployment Updates**

### **9.1 Update Process**

```bash
# Pull latest changes (if using Git)
cd ~/n8nWebDev
git pull origin main

# Install new dependencies
cd server
npm install

# Rebuild frontend
cd ../client
npm install
npm run build

# Restart application
cd ../server
pm2 restart n8nWebDev
```

### **9.2 Automated Deployment (Optional)**

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build

# Restart application
cd ../server && pm2 restart n8nWebDev

echo "Deployment completed!"
```

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Port 5000 not accessible**
   - Contact Hostinger support to open port 5000
   - Or use port 3000 (update .env file)

2. **Node.js not available**
   - Contact Hostinger support to enable Node.js
   - Or upgrade to a plan that supports Node.js

3. **PM2 not found**
   ```bash
   npm install -g pm2
   ```

4. **Permission denied**
   ```bash
   chmod +x deploy.sh
   chmod 755 ~/n8nWebDev
   ```

5. **Application not starting**
   ```bash
   # Check logs
   pm2 logs n8nWebDev
   
   # Check environment variables
   cat .env
   
   # Test manually
   node src/app.js
   ```

## 📞 **Hostinger Support**

If you encounter issues:

1. **Contact Hostinger Support** via live chat
2. **Request Node.js hosting** if not available
3. **Ask for port 5000 access** if needed
4. **Request SSH access** if not enabled

## ✅ **Deployment Checklist**

- [ ] Environment variables configured
- [ ] Frontend built for production
- [ ] SSH access enabled
- [ ] Node.js installed
- [ ] Dependencies installed
- [ ] PM2 configured
- [ ] Application running
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Health check working
- [ ] Logs accessible

## 🎯 **Final Steps**

1. **Test your application**: Visit `https://yourdomain.com`
2. **Test API endpoints**: `https://yourdomain.com/api/status`
3. **Test user registration**: `https://yourdomain.com/signup`
4. **Monitor logs**: `pm2 logs n8nWebDev`
5. **Set up monitoring**: Consider using PM2 Plus for advanced monitoring

Your application should now be live and accessible at your domain! 