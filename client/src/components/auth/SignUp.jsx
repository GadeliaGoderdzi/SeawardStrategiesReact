import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaAnchor } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { validateEmailDetailed, validatePasswordDetailed, validateNameDetailed, validateConfirmPassword } from '../../utils/validators';
import PropTypes from 'prop-types';

const SignUpContainer = styled(motion.div)`
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

const SignUpCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
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

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StrengthFill = styled(motion.div)`
  height: 100%;
  background: ${props => {
    switch (props.strength) {
      case 1: return '#dc3545';
      case 2: return '#fd7e14';
      case 3: return '#ffc107';
      case 4: return '#28a745';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 2px;
`;

const StrengthText = styled.span`
  font-size: 0.75rem;
  color: #64748b;
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
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

const SignUp = ({ onSuccess, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    const firstNameValidation = validateNameDetailed(formData.firstName);
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.message;
    }

    // Last name validation
    const lastNameValidation = validateNameDetailed(formData.lastName);
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.message;
    }

    // Email validation
    const emailValidation = validateEmailDetailed(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    // Password validation
    const passwordValidation = validatePasswordDetailed(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    // Confirm password validation
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        // Redirect to profile page after successful registration
        navigate('/profile');
        
        if (onSuccess) {
          onSuccess(result.user);
        }
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Failed to create account. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <SignUpContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SignUpCard variants={cardVariants}>
        <LogoSection>
          <Logo variants={logoVariants}>
            <FaAnchor />
          </Logo>
          <Title>Join Naval Command</Title>
          <Subtitle>Create your account to access maritime operations</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="firstName">First Name</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
            </InputWrapper>
            {errors.firstName && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.firstName}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </InputWrapper>
            {errors.lastName && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.lastName}
              </ErrorMessage>
            )}
          </InputGroup>

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
                placeholder="Create a strong password"
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
            {formData.password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill
                    strength={passwordStrength}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </StrengthBar>
                <StrengthText>
                  Password strength: {getStrengthText(passwordStrength)}
                </StrengthText>
              </PasswordStrength>
            )}
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

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.confirmPassword}
              </ErrorMessage>
            )}
          </InputGroup>

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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginLink>
          Already have an account?{' '}
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            if (onLoginClick) {
              onLoginClick();
            } else {
              navigate('/login');
            }
          }}>
            Sign in here
          </a>
        </LoginLink>
      </SignUpCard>
    </SignUpContainer>
  );
};

SignUp.propTypes = {
  onSuccess: PropTypes.func,
  onLoginClick: PropTypes.func
};

export default SignUp;