# Hostinger Deployment Guide

## Prerequisites
- Hostinger account
- Domain name (optional, can use subdomain)
- FTP client (FileZilla recommended)

## Option 1: VPS Deployment (Full-Stack)

### 1. Order Hostinger VPS
- Go to Hostinger → VPS Hosting
- Choose VPS plan (minimum 1GB RAM)
- Select Ubuntu 20.04/22.04 OS
- Complete purchase and setup

### 2. Connect to VPS
```bash
ssh root@your-vps-ip
```

### 3. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx
```

### 4. Upload Project Files
```bash
# Create project directory
mkdir -p /var/www/maritime-app
cd /var/www/maritime-app

# Upload your project files here (use FileZilla or git clone)
```

### 5. Configure Environment
```bash
# In your server directory
cp .env.example .env
# Edit with production values
nano .env
```

### 6. Build and Start Application
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies and build
cd ../client
npm install
npm run build

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Start backend with PM2
cd ../server
pm2 start src/app.js --name "maritime-backend"
pm2 startup
pm2 save
```

### 7. Configure Nginx
```bash
nano /etc/nginx/sites-available/maritime-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Serve React build files
    location / {
        root /var/www/maritime-app/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/maritime-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Option 2: Web Hosting + External Services

### 1. Frontend Deployment (Hostinger Web Hosting)

#### Prepare Build
```bash
# On your local machine
cd client
npm run build
```

#### Upload to Hostinger
1. Login to hPanel
2. Go to File Manager
3. Navigate to public_html
4. Upload all files from `client/build/` folder
5. Extract if compressed

### 2. Backend Deployment (Alternative Services)

#### Option A: Railway/Render/Heroku
- Deploy backend to cloud service
- Update API endpoints in frontend

#### Option B: Hostinger VPS (Backend Only)
- Order small VPS for backend only
- Follow VPS setup but only for backend

### 3. Database Options

#### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update backend .env file

#### Hostinger VPS MongoDB
- Install MongoDB on VPS
- Configure security groups
- Update connection string

## Production Configuration Files

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_NODE_ENV=production
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maritime_webapp
JWT_SECRET=your_super_secure_jwt_secret_change_this
JWT_REFRESH_SECRET=your_refresh_secret_change_this

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DEVELOPMENT_MODE=false

# Server Configuration
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true
```

## SSL Certificate (Free)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Domain Configuration
1. In Hostinger hPanel → Domains
2. Add your domain
3. Point A record to VPS IP
4. Wait for DNS propagation (24-48 hours)

## File Structure on Server
```
/var/www/maritime-app/
├── client/
│   ├── build/          # React production build
│   └── node_modules/
├── server/
│   ├── src/
│   ├── node_modules/
│   └── .env           # Production environment
└── logs/              # Application logs
```

## Monitoring and Maintenance
```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs maritime-backend

# Restart application
pm2 restart maritime-backend

# Check Nginx status
systemctl status nginx

# Check MongoDB status
systemctl status mongod
```

## Cost Estimation
- **VPS Plan**: $3.99-$8.99/month
- **Domain**: $8.99/year (optional)
- **MongoDB Atlas**: Free tier available
- **SSL Certificate**: Free (Let's Encrypt)

## Quick Start Checklist
- [ ] Purchase Hostinger VPS
- [ ] Set up domain (optional)
- [ ] Install dependencies on VPS
- [ ] Configure MongoDB (Atlas or VPS)
- [ ] Upload and build application
- [ ] Configure Nginx
- [ ] Set up SSL certificate
- [ ] Test application
- [ ] Set up monitoring

Need help with any specific step? I can provide more detailed instructions for your chosen deployment method.