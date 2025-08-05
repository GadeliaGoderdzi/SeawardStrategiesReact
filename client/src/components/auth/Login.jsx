import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaAnchor, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { validateEmailDetailed } from '../../utils/validators';
import SecureGoogleAuth from './SecureGoogleAuth';
import PropTypes from 'prop-types';

const LoginContainer = styled(motion.div)`
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

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #1a365d;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.error ? '#dc3545' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#dc3545' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #64748b;
  font-size: 1.1rem;
  z-index: 2;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 2;
  padding: 0;

  &:hover {
    color: #374151;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;

  a {
    color: #2563eb;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: -0.5rem 0 1rem 0;

  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  label {
    font-size: 0.9rem;
    font-weight: normal;
    color: #64748b;
    margin: 0;
    cursor: pointer;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #64748b;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const GoogleAuthWrapper = styled.div`
  width: 100%;
`;

const SocialButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    transform: translateY(-1px);
  }

  &.facebook:hover {
    border-color: #1877f2;
    color: #1877f2;
  }
`;

const SignUpLink = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1],
      delay: 0.2
    }
  }
};

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "backOut",
      delay: 0.4
    }
  }
};

const Login = ({ onSuccess, onSignUpClick, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailValidation = validateEmailDetailed(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        // Redirect to profile page after successful login
        navigate('/profile');
        
        if (onSuccess) {
          onSuccess(result.user);
        }
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Login failed. Please check your credentials.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (token, userData, serverResponse) => {
    try {
      setIsLoading(true);
      
      // Store the authentication token
      localStorage.setItem('authToken', serverResponse.token);
      
      // Update auth context if available
      if (login) {
        // Use the server response to update auth state
        await login.updateAuthState?.(serverResponse.user, serverResponse.token);
      }
      
      // Redirect to profile/dashboard
      navigate('/profile');
      
      if (onSuccess) {
        onSuccess(serverResponse.user);
      }
      
    } catch (error) {
      console.error('Google login success handler error:', error);
      setErrors({ 
        submit: 'Login completed but failed to redirect. Please try refreshing the page.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google authentication error:', error);
    
    let errorMessage = 'Google sign-in failed. Please try again.';
    
    // Provide more specific error messages
    if (error.message?.includes('popup')) {
      errorMessage = 'Pop-up was blocked. Please enable pop-ups and try again.';
    } else if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.message?.includes('CSRF')) {
      errorMessage = 'Security error. Please refresh the page and try again.';
    }
    
    setErrors({ 
      submit: errorMessage
    });
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'facebook') {
      console.log('Facebook login not yet implemented');
      setErrors({ 
        submit: 'Facebook login is coming soon!' 
      });
    }
  };

  return (
    <LoginContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <LoginCard variants={cardVariants}>
        <LogoSection>
          <Logo variants={logoVariants}>
            <FaAnchor />
          </Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your naval command center</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
            </InputWrapper>
            {errors.email && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password}
              </ErrorMessage>
            )}
          </InputGroup>

          <ForgotPassword>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onForgotPassword?.(); }}
            >
              Forgot your password?
            </a>
          </ForgotPassword>

          <RememberMe>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="rememberMe">Remember me for 30 days</label>
          </RememberMe>

          {errors.submit && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errors.submit}
            </ErrorMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && (
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <Divider>Or continue with</Divider>

        <SocialButtons>
          <GoogleAuthWrapper>
            <SecureGoogleAuth
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="Sign in with Google"
              buttonTheme="filled_blue"
              size="large"
              disabled={isLoading}
              enableOneTap={false}
              showFallback={true}
            />
          </GoogleAuthWrapper>
          
          <SocialButton
            type="button" 
            className="facebook"
            onClick={() => handleSocialLogin('facebook')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FaFacebookF />
            Facebook
          </SocialButton>
        </SocialButtons>

        <SignUpLink>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            if (onSignUpClick) {
              onSignUpClick();
            } else {
              navigate('/signup');
            }
          }}>
            Sign up here
          </a>
        </SignUpLink>
      </LoginCard>
    </LoginContainer>
  );
};

Login.propTypes = {
  onSuccess: PropTypes.func,
  onSignUpClick: PropTypes.func,
  onForgotPassword: PropTypes.func
};

export default Login;