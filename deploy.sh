#!/bin/bash

# n8nWebDev Deployment Script for Hostinger
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting n8nWebDev deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "server" ] || [ ! -d "client" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking current directory structure..."

# Backup current state
print_status "Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r server "$BACKUP_DIR/" 2>/dev/null || true
cp -r client "$BACKUP_DIR/" 2>/dev/null || true

print_status "Backup created in: $BACKUP_DIR"

# Update from Git (if using Git)
if [ -d ".git" ]; then
    print_status "Pulling latest changes from Git..."
    git pull origin main || {
        print_warning "Git pull failed, continuing with current files..."
    }
else
    print_warning "No Git repository found, using current files..."
fi

# Install server dependencies
print_status "Installing server dependencies..."
cd server
npm install --production || {
    print_error "Failed to install server dependencies"
    exit 1
}

# Install client dependencies and build
print_status "Installing client dependencies..."
cd ../client
npm install || {
    print_error "Failed to install client dependencies"
    exit 1
}

print_status "Building frontend for production..."
npm run build || {
    print_error "Failed to build frontend"
    exit 1
}

# Return to server directory for PM2
cd ../server

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found, installing globally..."
    npm install -g pm2 || {
        print_error "Failed to install PM2"
        exit 1
    }
fi

# Check if application is already running
if pm2 list | grep -q "n8nWebDev"; then
    print_status "Restarting existing application..."
    pm2 restart n8nWebDev || {
        print_error "Failed to restart application"
        exit 1
    }
else
    print_status "Starting new application..."
    pm2 start ecosystem.config.js || {
        print_error "Failed to start application"
        exit 1
    }
fi

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save || {
    print_warning "Failed to save PM2 configuration"
}

# Setup PM2 startup (if not already done)
if ! pm2 startup | grep -q "already inited"; then
    print_status "Setting up PM2 startup..."
    pm2 startup || {
        print_warning "Failed to setup PM2 startup (this is normal for shared hosting)"
    }
fi

# Check application status
print_status "Checking application status..."
sleep 3
pm2 status

# Test health endpoint
print_status "Testing application health..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/status || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    print_status "✅ Application is healthy and responding!"
else
    print_warning "⚠️  Health check returned status: $HEALTH_CHECK"
    print_status "Check logs with: pm2 logs n8nWebDev"
fi

# Show useful commands
echo ""
print_status "Deployment completed successfully!"
echo ""
echo "Useful commands:"
echo "  pm2 status                    - Check application status"
echo "  pm2 logs n8nWebDev           - View application logs"
echo "  pm2 restart n8nWebDev        - Restart application"
echo "  pm2 stop n8nWebDev           - Stop application"
echo "  pm2 monit                    - Monitor application in real-time"
echo ""
echo "Log files:"
echo "  tail -f logs/app.log         - View application logs"
echo "  tail -f logs/err.log         - View error logs"
echo "  tail -f logs/out.log         - View output logs"
echo ""

# Cleanup old backups (keep last 5)
print_status "Cleaning up old backups..."
cd ..
BACKUP_COUNT=$(ls -d backup_* 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 5 ]; then
    ls -dt backup_* | tail -n +6 | xargs rm -rf
    print_status "Cleaned up old backups"
fi

print_status "🎉 Deployment completed successfully!"