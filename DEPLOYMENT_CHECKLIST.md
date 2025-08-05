# 🚀 Hostinger Deployment Checklist

## 📋 **Pre-Deployment Checklist**

### **Environment Setup**
- [ ] **Production .env file** created in `server/` directory
- [ ] **JWT_SECRET** generated and configured (64+ characters)
- [ ] **JWT_REFRESH_SECRET** generated and configured
- [ ] **Domain URLs** updated in environment variables
- [ ] **Email service** configured (Gmail/Mailtrap/etc.)
- [ ] **CORS_ORIGIN** set to your domain
- [ ] **NODE_ENV** set to 'production'

### **Code Preparation**
- [ ] **Frontend built** for production (`npm run build`)
- [ ] **Dependencies installed** in both client and server
- [ ] **Environment variables** tested locally
- [ ] **Git repository** up to date (if using Git)
- [ ] **Deployment files** created:
  - [ ] `ecosystem.config.js`
  - [ ] `deploy.sh`
  - [ ] `.htaccess`

## 🌐 **Hostinger Server Setup**

### **Account & Access**
- [ ] **Hostinger account** active with Node.js hosting
- [ ] **SSH access** enabled in control panel
- [ ] **Domain/subdomain** configured
- [ ] **SSL certificate** installed
- [ ] **SSH credentials** noted down

### **Server Environment**
- [ ] **Node.js** installed and working
- [ ] **npm** available
- [ ] **PM2** installed globally
- [ ] **Project directory** created
- [ ] **File permissions** set correctly

## 📁 **File Upload & Setup**

### **Upload Methods**
Choose one:
- [ ] **Git clone** (recommended)
- [ ] **File Manager** upload
- [ ] **FTP/SFTP** upload

### **File Structure**
- [ ] **Project files** uploaded to server
- [ ] **Environment file** (.env) in server directory
- [ ] **Build files** in client/build directory
- [ ] **Deployment scripts** executable

## ⚙️ **Application Configuration**

### **Dependencies**
- [ ] **Server dependencies** installed (`npm install --production`)
- [ ] **Client dependencies** installed (`npm install`)
- [ ] **Frontend built** (`npm run build`)

### **Process Management**
- [ ] **PM2 ecosystem** configured
- [ ] **Logs directory** created
- [ ] **Application started** with PM2
- [ ] **PM2 startup** configured

## 🔧 **Domain & Proxy Setup**

### **Apache Configuration**
- [ ] **.htaccess file** uploaded to public_html
- [ ] **Proxy rules** configured correctly
- [ ] **Static files** serving properly
- [ ] **API routes** proxying to Node.js

### **Domain Configuration**
- [ ] **Domain pointing** to hosting account
- [ ] **SSL certificate** active
- [ ] **HTTPS redirect** enabled
- [ ] **CORS settings** updated for domain

## 🧪 **Testing & Verification**

### **Application Health**
- [ ] **Server starting** without errors
- [ ] **Health endpoint** responding (`/api/status`)
- [ ] **Frontend loading** correctly
- [ ] **API endpoints** working

### **Functionality Testing**
- [ ] **User registration** working
- [ ] **Email verification** sending
- [ ] **User login** functional
- [ ] **Protected routes** working
- [ ] **File uploads** (if applicable)

### **Performance & Security**
- [ ] **SSL certificate** working
- [ ] **Security headers** present
- [ ] **Rate limiting** active
- [ ] **Error handling** working

## 📊 **Monitoring & Maintenance**

### **Logs & Monitoring**
- [ ] **PM2 logs** accessible
- [ ] **Application logs** working
- [ ] **Error logs** being written
- [ ] **Performance monitoring** set up

### **Backup & Recovery**
- [ ] **Database backups** configured (if using DB)
- [ ] **File backups** set up
- [ ] **Environment backup** created
- [ ] **Rollback plan** prepared

## 🔒 **Security Verification**

### **Environment Security**
- [ ] **.env file** not accessible via web
- [ ] **JWT secrets** are strong and unique
- [ ] **Email credentials** are app passwords
- [ ] **CORS** properly configured

### **Application Security**
- [ ] **Rate limiting** working
- [ ] **Input validation** active
- [ ] **XSS protection** enabled
- [ ] **CSRF protection** (if applicable)

## 🚀 **Final Deployment Steps**

### **Go Live Checklist**
- [ ] **All tests passing**
- [ ] **Domain accessible**
- [ ] **SSL working**
- [ ] **Email sending**
- [ ] **User registration working**
- [ ] **Login functional**

### **Post-Deployment**
- [ ] **Monitor logs** for 24 hours
- [ ] **Test all features** thoroughly
- [ ] **Check performance** metrics
- [ ] **Verify backups** are working
- [ ] **Document deployment** process

## 🆘 **Troubleshooting Checklist**

### **Common Issues**
- [ ] **Port 5000 blocked** → Contact Hostinger support
- [ ] **Node.js not available** → Upgrade hosting plan
- [ ] **PM2 not found** → Install globally
- [ ] **Permission denied** → Check file permissions
- [ ] **CORS errors** → Verify domain configuration

### **Support Resources**
- [ ] **Hostinger support** contacted if needed
- [ ] **Documentation** reviewed
- [ ] **Community forums** checked
- [ ] **Stack Overflow** searched

## ✅ **Success Indicators**

When deployment is successful, you should see:

- ✅ **Application accessible** at your domain
- ✅ **SSL certificate** working (green lock)
- ✅ **API endpoints** responding
- ✅ **User registration** working
- ✅ **Email verification** sending
- ✅ **Login system** functional
- ✅ **PM2 status** showing running
- ✅ **Logs** being written
- ✅ **No errors** in console

## 📞 **Emergency Contacts**

- **Hostinger Support**: Live chat in control panel
- **Documentation**: `DEPLOYMENT_HOSTINGER_GUIDE.md`
- **Troubleshooting**: `DEPLOYMENT_CHECKLIST.md`
- **Environment Setup**: `PRODUCTION_ENV_TEMPLATE.md`

---

**🎉 Congratulations! Your application is now live on Hostinger!** 