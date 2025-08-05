import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCheck, 
  FaTimes, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaRedo,
  FaEnvelope,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Container = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="1"/></g></g></svg>');
    z-index: 0;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const IconContainer = styled(motion.div)`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  ${props => {
    if (props.status === 'loading') {
      return `
        background: linear-gradient(45deg, #6c757d, #495057);
        box-shadow: 0 10px 30px rgba(108, 117, 125, 0.3);
      `;
    } else if (props.status === 'success') {
      return `
        background: linear-gradient(45deg, #28a745, #20c997);
        box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
      `;
    } else if (props.status === 'error') {
      return `
        background: linear-gradient(45deg, #dc3545, #c82333);
        box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
      `;
    } else {
      return `
        background: linear-gradient(45deg, #ffc107, #e0a800);
        box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
      `;
    }
  }}
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const DetailMessage = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    }
  ` : props.variant === 'success' ? `
    background: linear-gradient(45deg, #28a745, #20c997);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
    }
  ` : `
    background: transparent;
    color: #64748b;
    border: 2px solid #e2e8f0;
    
    &:hover:not(:disabled) {
      border-color: #2563eb;
      color: #2563eb;
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
  
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const [detailMessage, setDetailMessage] = useState('');
  const [user, setUser] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setMessage('Invalid Verification Link');
      setDetailMessage('The verification link is missing required information. Please use the complete link from your email or request a new verification email.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`);
      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('Email Verified Successfully!');
        setDetailMessage('Your email has been verified and you are now logged in. You will be redirected to complete your profile setup.');
        setUser(data.user);
        
        // Store the login token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Redirect to profile completion after a short delay
        setTimeout(() => {
          if (data.user.profile?.completed) {
            navigate('/dashboard');
          } else {
            navigate('/complete-profile');
          }
        }, 3000);
        
      } else {
        setVerificationStatus('error');
        
        if (data.expired) {
          setMessage('Verification Link Expired');
          setDetailMessage('This verification link has expired. Verification links are valid for 24 hours. Please request a new verification email.');
          setCanResend(true);
        } else if (data.invalid) {
          setMessage('Invalid Verification Link');
          setDetailMessage('This verification link is invalid or has already been used. Please check the link or request a new verification email.');
          setCanResend(true);
        } else if (data.alreadyVerified) {
          setVerificationStatus('warning');
          setMessage('Email Already Verified');
          setDetailMessage('Your email address has already been verified. You can proceed to log in to your account.');
        } else {
          setMessage('Verification Failed');
          setDetailMessage(data.message || 'We encountered an error while verifying your email address. Please try again or contact support.');
          setCanResend(true);
        }
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setMessage('Verification Failed');
      setDetailMessage('We encountered a technical error while verifying your email address. Please try again or contact support.');
      setCanResend(true);
    }
  };

  const handleResendVerification = async () => {
    // This would require getting the email from somewhere
    // For now, redirect to resend page
    navigate('/resend-verification');
  };

  const getIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner />
          </LoadingSpinner>
        );
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaTimes />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaSpinner />;
    }
  };

  const getActions = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <>
            <Button
              variant="success"
              onClick={() => {
                if (user?.profile?.completed) {
                  navigate('/dashboard');
                } else {
                  navigate('/complete-profile');
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaShieldAlt />
              Continue to Profile Setup
            </Button>
          </>
        );
      case 'error':
        return (
          <>
            {canResend && (
              <Button
                variant="primary"
                onClick={handleResendVerification}
                disabled={isResending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isResending ? <FaSpinner className="fa-spin" /> : <FaRedo />}
                {isResending ? 'Sending...' : 'Get New Verification Email'}
              </Button>
            )}
            <LinkButton to="/login">
              Return to Login
            </LinkButton>
          </>
        );
      case 'warning':
        return (
          <>
            <LinkButton to="/login">
              <FaShieldAlt />
              Go to Login
            </LinkButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <IconContainer
          status={verificationStatus}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
        >
          {getIcon()}
        </IconContainer>

        <Title>{message}</Title>
        
        {detailMessage && (
          <DetailMessage>{detailMessage}</DetailMessage>
        )}

        {verificationStatus === 'success' && user && (
          <Message>
            Welcome, <strong>{user.name || `${user.firstName} ${user.lastName}`}</strong>! 
            Your account is now fully verified.
          </Message>
        )}

        {verificationStatus === 'loading' && (
          <Message>
            Please wait while we verify your email address. This should only take a moment.
          </Message>
        )}

        <ButtonGroup>
          {getActions()}
        </ButtonGroup>

        {verificationStatus === 'success' && (
          <DetailMessage style={{ marginTop: '2rem' }}>
            <FaCheck style={{ color: '#28a745', marginRight: '0.5rem' }} />
            <strong>Next Steps:</strong> Complete your profile setup with a profile photo, 
            phone number, and bio to get full access to all features.
          </DetailMessage>
        )}
      </Card>
    </Container>
  );
};

export default EmailVerification;