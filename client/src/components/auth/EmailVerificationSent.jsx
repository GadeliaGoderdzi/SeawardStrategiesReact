import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaRedo, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

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
  background: linear-gradient(45deg, #28a745, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
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

const EmailDisplay = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #2563eb;
  font-weight: 600;
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

const Alert = styled(motion.div)`
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  ${props => props.type === 'success' ? `
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
  ` : props.type === 'error' ? `
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
  ` : `
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
  `}
`;

const InstructionList = styled.ol`
  text-align: left;
  color: #64748b;
  line-height: 1.6;
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const EmailVerificationSent = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resendCount, setResendCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || 'your email';
  const message = location.state?.message || 'Please check your email to verify your account.';

  const handleResendVerification = async () => {
    if (resendCount >= 3) {
      setResendStatus('error');
      return;
    }

    setIsResending(true);
    setResendStatus('');
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setResendStatus('success');
        setResendCount(prev => prev + 1);
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
        >
          <FaEnvelope />
        </IconContainer>

        <Title>Check Your Email</Title>
        
        <Message>{message}</Message>

        <EmailDisplay>{email}</EmailDisplay>

        <InstructionList>
          <li>Check your inbox (and spam folder) for a verification email</li>
          <li>Click the verification link in the email</li>
          <li>You'll be automatically logged in and redirected to complete your profile</li>
          <li>The verification link expires in 24 hours</li>
        </InstructionList>

        {resendStatus === 'success' && (
          <Alert
            type="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaCheck />
            Verification email sent successfully! Please check your inbox.
          </Alert>
        )}

        {resendStatus === 'error' && (
          <Alert
            type="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle />
            {resendCount >= 3 
              ? 'Maximum resend attempts reached. Please contact support if you continue having issues.'
              : 'Failed to resend verification email. Please try again.'
            }
          </Alert>
        )}

        <ButtonGroup>
          <Button
            variant="primary"
            onClick={handleResendVerification}
            disabled={isResending || resendCount >= 3}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isResending && <FaSpinner className="fa-spin" />}
            <FaRedo />
            {isResending ? 'Resending...' : 'Resend Verification Email'}
          </Button>

          <LinkButton to="/login">
            Return to Login
          </LinkButton>
        </ButtonGroup>

        <Alert type="warning" style={{ marginTop: '2rem' }}>
          <FaExclamationTriangle />
          <div>
            <strong>Having trouble?</strong> Make sure to check your spam folder. 
            If you still don't receive the email, try resending or contact our support team.
          </div>
        </Alert>
      </Card>
    </Container>
  );
};

export default EmailVerificationSent;