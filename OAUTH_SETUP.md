# OAuth Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your application.

## Google OAuth Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Naval Fleet Management"
   - User support email: your email
   - Developer contact information: your email

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain
6. Copy the Client ID and update your `.env` files

### 4. Update Environment Variables
In `client/.env`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

In `.env` (server):
```
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

## Facebook OAuth Setup

### 1. Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App Name: "Naval Fleet Management"
   - Contact Email: your email

### 2. Configure Facebook Login
1. In your app dashboard, go to "Add a Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Enter your site URL: `http://localhost:3000` (for development)

### 3. Configure Valid OAuth Redirect URIs
1. Go to "Facebook Login" > "Settings"
2. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000/` (for development)
   - Your production domain

### 4. Get App ID and Secret
1. Go to "Settings" > "Basic"
2. Copy your App ID and App Secret
3. Update your environment variables

### 5. Update Environment Variables
In `client/.env`:
```
REACT_APP_FACEBOOK_APP_ID=your_actual_facebook_app_id_here
```

In `.env` (server):
```
FACEBOOK_APP_ID=your_actual_facebook_app_id_here
FACEBOOK_APP_SECRET=your_actual_facebook_app_secret_here
```

## Testing OAuth Integration

### Development Testing
1. Start your development servers:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login` or `http://localhost:3000/signup`

3. Click on the Google or Facebook login buttons

4. You should be redirected to the respective OAuth providers

### Production Deployment
1. Update your OAuth app configurations with production URLs
2. Update environment variables with production values
3. Ensure HTTPS is enabled for production

## Security Best Practices

1. **Never commit OAuth secrets to version control**
2. **Use HTTPS in production**
3. **Restrict OAuth redirect URIs to your domains only**
4. **Regularly rotate your OAuth secrets**
5. **Monitor OAuth usage in your provider dashboards**

## Troubleshooting

### Common Issues
1. **"Invalid client_id"**: Check that your client ID is correctly set in environment variables
2. **"Redirect URI mismatch"**: Ensure your redirect URIs are exactly as configured in OAuth providers
3. **CORS errors**: Check that your domains are whitelisted in OAuth provider settings

### Testing Without OAuth Providers
If you haven't set up OAuth providers yet, you can still test email/password authentication. The OAuth buttons will show as "not configured" but won't break the application.

## Environment Variables Template

Copy this to your `.env` files and replace with actual values:

### Client (.env)
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Naval Fleet Management
REACT_APP_VERSION=1.0.0
```

### Server (.env)
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```