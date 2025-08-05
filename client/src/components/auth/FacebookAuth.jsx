import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaFacebookF } from 'react-icons/fa';
import PropTypes from 'prop-types';

const FacebookButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: #166fe5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FacebookAuth = ({ onSuccess, onError, text = "Continue with Facebook" }) => {
  useEffect(() => {
    const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
    
    if (!appId || appId === 'your_facebook_app_id_here') {
      console.warn('Facebook OAuth not configured. Please set REACT_APP_FACEBOOK_APP_ID in your .env file');
      return;
    }

    // Load Facebook SDK
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.fbAsyncInit = () => {
          try {
            window.FB.init({
              appId: appId,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
          } catch (error) {
            console.error('Facebook OAuth initialization error:', error);
            onError(new Error('Facebook OAuth configuration error'));
          }
        };
        
        if (window.fbAsyncInit) {
          window.fbAsyncInit();
        }
      };

      script.onerror = () => {
        console.error('Failed to load Facebook SDK');
        onError(new Error('Failed to load Facebook OAuth'));
      };

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [onError]);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      onError(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        // Get user info
        window.FB.api('/me', { fields: 'name,email,first_name,last_name,picture' }, (userInfo) => {
          if (userInfo && !userInfo.error) {
            const userData = {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              first_name: userInfo.first_name,
              last_name: userInfo.last_name,
              picture: userInfo.picture
            };
            
            onSuccess(response.authResponse.accessToken, userData);
          } else {
            onError(new Error('Failed to get user information from Facebook'));
          }
        });
      } else {
        onError(new Error('Facebook login was cancelled or failed'));
      }
    }, { 
      scope: 'email,public_profile',
      return_scopes: true 
    });
  };

  const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
  const isConfigured = appId && appId !== 'your_facebook_app_id_here';

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
        <div style={{ marginBottom: '8px' }}>🔧 Facebook OAuth Not Configured</div>
        <div style={{ fontSize: '12px' }}>
          Set REACT_APP_FACEBOOK_APP_ID in your .env file
        </div>
      </div>
    );
  }

  return (
    <div>
      <FacebookButton onClick={handleFacebookLogin}>
        <FaFacebookF />
        {text}
      </FacebookButton>
    </div>
  );
};

FacebookAuth.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  text: PropTypes.string
};

export default FacebookAuth;