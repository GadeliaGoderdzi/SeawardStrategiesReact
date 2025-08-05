import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GoogleAuth = ({ onSuccess, onError, text = "Sign in with Google" }) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Only load Google OAuth if client ID is properly configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'your_google_client_id_here') {
      console.warn('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'filled_blue',
              size: 'large',
              text: text.includes('Sign up') ? 'signup_with' : 'signin_with',
              width: '100%',
              logo_alignment: 'left',
            });
          }
        } catch (error) {
          console.error('Google OAuth initialization error:', error);
          onError(new Error('Google OAuth configuration error'));
        }
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google OAuth script');
      onError(new Error('Failed to load Google OAuth'));
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [text, onError]);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email_verified: payload.email_verified,
      };

      onSuccess(response.credential, userData);
    } catch (error) {
      console.error('Google authentication error:', error);
      onError(error);
    }
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId !== 'your_google_client_id_here';

  if (!isConfigured) {
    return (
      <div style={{ 
        padding: '12px', 
        border: '2px dashed #ccc', 
        borderRadius: '8px', 
        textAlign: 'center',
        background: '#f9f9f9',
        color: '#666'
      }}>
        <div style={{ marginBottom: '8px' }}>🔧 Google OAuth Not Configured</div>
        <div style={{ fontSize: '12px' }}>
          Set REACT_APP_GOOGLE_CLIENT_ID in your .env file
        </div>
      </div>
    );
  }

  return (
    <div>
      <div ref={googleButtonRef} style={{ width: '100%' }}></div>
    </div>
  );
};

GoogleAuth.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  text: PropTypes.string
};

export default GoogleAuth;