import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components for enhanced UI
const GoogleAuthContainer = styled.div`
  width: 100%;
  position: relative;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
`;

const FallbackButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #3367d6;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: 2px solid #4285f4;
    outline-offset: 2px;
  }
`;

const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const ConfigWarning = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  text-align: center;
  font-size: 14px;
  
  strong {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  code {
    background: rgba(0,0,0,0.1);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
`;

const SecureGoogleAuth = ({ 
  onSuccess, 
  onError, 
  text = "Sign in with Google",
  buttonTheme = "filled_blue",
  size = "large",
  autoSelect = false,
  enableOneTap = false,
  cancelOnTapOutside = true,
  className,
  disabled = false,
  showFallback = true
}) => {
  const googleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Enhanced security: Generate CSRF token for each session
  const csrfTokenRef = useRef(null);
  
  useEffect(() => {
    // Generate CSRF token
    csrfTokenRef.current = generateCSRFToken();
  }, []);

  const generateCSRFToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Enhanced credential response handler with security validation
  const handleCredentialResponse = useCallback(async (response) => {
    setIsLoading(true);
    setError(null);

    try {
      // Enhanced security: Validate response structure
      if (!response || !response.credential) {
        throw new Error('Invalid credential response from Google');
      }

      // Enhanced security: Basic JWT structure validation
      const jwtParts = response.credential.split('.');
      if (jwtParts.length !== 3) {
        throw new Error('Invalid JWT token structure');
      }

      // Enhanced security: Decode and validate header
      const header = JSON.parse(atob(jwtParts[0]));
      if (header.alg !== 'RS256') {
        throw new Error('Invalid JWT algorithm');
      }

      // Enhanced security: Decode payload for basic validation
      const payload = JSON.parse(atob(jwtParts[1]));
      
      // Enhanced security: Validate required claims
      const requiredClaims = ['iss', 'aud', 'exp', 'sub', 'email'];
      for (const claim of requiredClaims) {
        if (!payload[claim]) {
          throw new Error(`Missing required claim: ${claim}`);
        }
      }

      // Enhanced security: Validate issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (!validIssuers.includes(payload.iss)) {
        throw new Error('Invalid token issuer');
      }

      // Enhanced security: Validate audience
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      if (payload.aud !== clientId) {
        throw new Error('Token audience mismatch');
      }

      // Enhanced security: Validate expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        throw new Error('Token has expired');
      }

      // Enhanced security: Validate issued at time (iat)
      if (payload.iat && payload.iat > now) {
        throw new Error('Token issued in the future');
      }

      // Enhanced security: Validate email verification
      if (!payload.email_verified) {
        throw new Error('Email not verified by Google');
      }

      // Send token to backend for server-side verification
      const verificationResult = await verifyTokenWithBackend(response.credential, csrfTokenRef.current);
      
      if (!verificationResult.success) {
        throw new Error(verificationResult.error || 'Backend token verification failed');
      }

      // Extract user data from verified payload
      const userData = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email_verified: payload.email_verified,
        locale: payload.locale,
        hd: payload.hd // Hosted domain for GSuite accounts
      };

      // Success callback with verified data
      onSuccess(verificationResult.token, userData, verificationResult.user);

    } catch (error) {
      console.error('Google authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  // Backend token verification
  const verifyTokenWithBackend = async (idToken, csrfToken) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          // Enhanced security: Add additional headers
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include', // Enhanced security: Include cookies for session management
        body: JSON.stringify({ 
          idToken,
          csrfToken,
          origin: window.location.origin
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Backend verification error:', error);
      throw new Error('Failed to verify token with server');
    }
  };

  // Enhanced script loading with retry logic
  const loadGoogleScript = useCallback(() => {
    if (scriptLoaded || document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    // Enhanced security: Add integrity check if available
    // script.integrity = "sha384-..."; // Add actual integrity hash
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setScriptLoaded(true);
      retryCountRef.current = 0;
    };

    script.onerror = () => {
      console.error('Failed to load Google OAuth script');
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => {
          loadGoogleScript();
        }, 1000 * retryCountRef.current); // Exponential backoff
      } else {
        setError('Unable to load Google authentication. Please check your connection or try again later.');
      }
    };

    document.head.appendChild(script);
  }, [scriptLoaded]);

  // Initialize Google Identity Services
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'your_google_client_id_here') {
      console.warn('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
      return;
    }

    if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
      console.warn('Google OAuth requires HTTPS in production');
      setError('HTTPS required for Google Sign-In in production');
      return;
    }

    loadGoogleScript();
  }, [loadGoogleScript]);

  // Initialize Google OAuth when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !window.google) return;

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: autoSelect,
        cancel_on_tap_outside: cancelOnTapOutside,
        // Enhanced security: Additional configuration
        use_fedcm_for_prompt: true,
        itp_support: true,
        allowed_parent_origin: [window.location.origin]
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: buttonTheme,
          size: size,
          text: text.includes('Sign up') ? 'signup_with' : 'signin_with',
          width: '100%',
          logo_alignment: 'left',
          // Enhanced UX: Accessibility
          accessible: true
        });
      }

      // Enhanced UX: Enable One-Tap if requested
      if (enableOneTap) {
        window.google.accounts.id.prompt();
      }

      setGoogleReady(true);
      setError(null);

    } catch (error) {
      console.error('Google OAuth initialization error:', error);
      setError('Failed to initialize Google authentication');
      onError(new Error('Google OAuth configuration error'));
    }
  }, [scriptLoaded, handleCredentialResponse, buttonTheme, size, text, autoSelect, cancelOnTapOutside, enableOneTap, onError]);

  // Enhanced fallback handler
  const handleFallbackClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt();
      } else {
        // Retry loading Google script
        loadGoogleScript();
      }
    } catch (error) {
      setError('Unable to start Google authentication');
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check configuration
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId !== 'your_google_client_id_here';

  if (!isConfigured) {
    return (
      <ConfigWarning>
        <strong>🔧 Google OAuth Configuration Required</strong>
        <div>To enable Google Sign-In:</div>
        <ol style={{ textAlign: 'left', margin: '8px 0' }}>
          <li>Get your Client ID from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
          <li>Add <code>REACT_APP_GOOGLE_CLIENT_ID=your_client_id</code> to your .env file</li>
          <li>Configure authorized origins in GCP Console</li>
        </ol>
      </ConfigWarning>
    );
  }

  return (
    <GoogleAuthContainer className={className}>
      <div ref={googleButtonRef} style={{ width: '100%', minHeight: '40px' }}>
        {!googleReady && showFallback && (
          <FallbackButton 
            onClick={handleFallbackClick}
            disabled={disabled || isLoading}
            aria-label={text}
          >
            <GoogleIcon viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </GoogleIcon>
            {text}
          </FallbackButton>
        )}
      </div>

      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Spinner />
          </LoadingOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>
    </GoogleAuthContainer>
  );
};

SecureGoogleAuth.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  text: PropTypes.string,
  buttonTheme: PropTypes.oneOf(['outline', 'filled_blue', 'filled_black']),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  autoSelect: PropTypes.bool,
  enableOneTap: PropTypes.bool,
  cancelOnTapOutside: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showFallback: PropTypes.bool
};

export default SecureGoogleAuth;