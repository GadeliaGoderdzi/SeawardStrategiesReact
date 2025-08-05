/**
 * Google OAuth Testing Utilities
 * 
 * This file contains utilities for testing Google OAuth implementation
 * in development and production environments.
 */

// Test configuration validator
export const validateGoogleAuthConfig = () => {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    config: {}
  };

  // Check client ID
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    results.valid = false;
    results.errors.push('REACT_APP_GOOGLE_CLIENT_ID not set in environment');
  } else if (clientId === 'your_google_client_id_here') {
    results.valid = false;
    results.errors.push('REACT_APP_GOOGLE_CLIENT_ID still has placeholder value');
  } else {
    results.config.clientId = clientId;
  }

  // Check HTTPS in production
  if (process.env.NODE_ENV === 'production' && !window.location.protocol.includes('https')) {
    results.valid = false;
    results.errors.push('HTTPS required for Google OAuth in production');
  }

  // Check localhost configuration
  if (window.location.hostname === 'localhost') {
    results.warnings.push('Using localhost - ensure this origin is configured in Google Console');
  }

  // Check if Google script can be loaded
  if (typeof window.google === 'undefined') {
    results.warnings.push('Google Identity Services script not yet loaded');
  }

  return results;
};

// Test Google token validation
export const testTokenValidation = (idToken) => {
  try {
    // Basic JWT structure validation
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT structure' };
    }

    // Decode header
    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'RS256') {
      return { valid: false, error: 'Invalid algorithm' };
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check required claims
    const requiredClaims = ['iss', 'aud', 'exp', 'sub', 'email'];
    for (const claim of requiredClaims) {
      if (!payload[claim]) {
        return { valid: false, error: `Missing claim: ${claim}` };
      }
    }

    // Check issuer
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) {
      return { valid: false, error: 'Invalid issuer' };
    }

    // Check audience
    if (payload.aud !== process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      return { valid: false, error: 'Audience mismatch' };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return { valid: false, error: 'Token expired' };
    }

    return { 
      valid: true, 
      payload,
      expiresIn: payload.exp - now
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Test backend connectivity
export const testBackendAuth = async (idToken, csrfToken) => {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify({
        idToken,
        csrfToken,
        origin: window.location.origin
      })
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate test CSRF token
export const generateTestCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Log configuration for debugging
export const logGoogleAuthConfig = () => {
  const config = validateGoogleAuthConfig();
  
  console.group('🔐 Google OAuth Configuration');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Origin:', window.location.origin);
  console.log('Client ID:', config.config.clientId || 'Not configured');
  console.log('HTTPS:', window.location.protocol.includes('https'));
  
  if (config.errors.length > 0) {
    console.error('❌ Errors:', config.errors);
  }
  
  if (config.warnings.length > 0) {
    console.warn('⚠️ Warnings:', config.warnings);
  }
  
  if (config.valid) {
    console.log('✅ Configuration appears valid');
  }
  
  console.groupEnd();
  
  return config;
};

// Test suite for Google OAuth
export const runGoogleAuthTests = async () => {
  console.group('🧪 Google OAuth Test Suite');
  
  const results = {
    config: null,
    scriptLoaded: false,
    apiAvailable: false,
    errors: []
  };

  try {
    // Test 1: Configuration
    console.log('Testing configuration...');
    results.config = validateGoogleAuthConfig();
    
    // Test 2: Script loading
    console.log('Testing Google script...');
    results.scriptLoaded = typeof window.google !== 'undefined';
    
    // Test 3: API availability
    console.log('Testing Google API...');
    results.apiAvailable = !!(window.google?.accounts?.id);
    
    // Test 4: Client initialization (if possible)
    if (results.apiAvailable && results.config.valid) {
      console.log('Testing client initialization...');
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: () => {}, // Dummy callback for testing
        });
        console.log('✅ Client initialization successful');
      } catch (error) {
        results.errors.push(`Client initialization failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    results.errors.push(`Test suite error: ${error.message}`);
  }

  // Summary
  console.log('\n📊 Test Results:');
  console.log('Configuration Valid:', results.config?.valid);
  console.log('Google Script Loaded:', results.scriptLoaded);
  console.log('Google API Available:', results.apiAvailable);
  console.log('Errors:', results.errors.length);
  
  if (results.errors.length > 0) {
    console.error('Test Errors:', results.errors);
  }
  
  console.groupEnd();
  
  return results;
};

// Development helper - run tests on load
if (process.env.NODE_ENV === 'development') {
  // Auto-run tests after a short delay to allow Google script to load
  setTimeout(() => {
    if (window.location.search.includes('debug=google-auth')) {
      runGoogleAuthTests();
    }
  }, 2000);
}

// Export all utilities
export default {
  validateGoogleAuthConfig,
  testTokenValidation,
  testBackendAuth,
  generateTestCSRFToken,
  logGoogleAuthConfig,
  runGoogleAuthTests
};