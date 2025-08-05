import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaAnchor, 
  FaCheck, 
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

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
  max-width: 480px;
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

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
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
  border: 2px solid ${props => {
    if (props.error) return '#dc3545';
    if (props.valid) return '#28a745';
    if (props.focused) return '#2563eb';
    return '#e2e8f0';
  }};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => {
      if (props.error) return 'rgba(220, 53, 69, 0.1)';
      if (props.valid) return 'rgba(40, 167, 69, 0.1)';
      return 'rgba(37, 99, 235, 0.1)';
    }};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${props => {
    if (props.error) return '#dc3545';
    if (props.valid) return '#28a745';
    if (props.focused) return '#2563eb';
    return '#64748b';
  }};
  font-size: 1.1rem;
  z-index: 2;
  transition: color 0.3s ease;
`;

const ValidationIcon = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.valid ? '#28a745' : '#dc3545'};
  font-size: 1.1rem;
  z-index: 2;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.hasValidation ? '2.5rem' : '1rem'};
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

const SuccessMessage = styled(motion.div)`
  color: #28a745;
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
    if (props.strength >= 4) return '#28a745';
    if (props.strength >= 3) return '#fbbf24';
    if (props.strength >= 2) return '#f59e0b';
    return '#dc3545';
  }};
  transition: all 0.3s ease;
`;

const StrengthText = styled.div`
  font-size: 0.75rem;
  color: ${props => {
    if (props.strength >= 4) return '#28a745';
    if (props.strength >= 3) return '#fbbf24';
    if (props.strength >= 2) return '#f59e0b';
    return '#dc3545';
  }};
  font-weight: 500;
`;

const StrengthRequirements = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  color: ${props => props.met ? '#28a745' : '#64748b'};
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 1rem;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
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

const EnhancedSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Real-time email uniqueness check
  useEffect(() => {
    const checkEmailUniqueness = async () => {
      if (formData.email && isValidEmail(formData.email)) {
        setEmailCheckLoading(true);
        try {
          const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(formData.email)}`);
          const data = await response.json();
          
          if (data.exists) {
            setEmailExists(true);
            setErrors(prev => ({ ...prev, email: 'Email already registered' }));
          } else {
            setEmailExists(false);
            setErrors(prev => ({ ...prev, email: '' }));
            setValidFields(prev => ({ ...prev, email: true }));
          }
        } catch (error) {
          console.error('Email check failed:', error);
        } finally {
          setEmailCheckLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkEmailUniqueness, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.email]);

  // Password strength calculation
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordRequirements = (password) => {
    return [
      { text: '8+ characters', met: password.length >= 8 },
      { text: 'Lowercase letter', met: /[a-z]/.test(password) },
      { text: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'Number', met: /[0-9]/.test(password) },
      { text: 'Special character', met: /[^A-Za-z0-9]/.test(password) }
    ];
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.trim().length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        if (value.trim().length > 25) return `${name === 'firstName' ? 'First' : 'Last'} name must be less than 25 characters`;
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email address';
        if (emailExists) return 'Email already registered';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (passwordStrength < 4) return 'Password is too weak';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Mark field as valid if no error
    if (!error && value.trim()) {
      setValidFields(prev => ({ ...prev, [name]: true }));
    } else {
      setValidFields(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sign Up button clicked!', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    console.log('Starting signup process...');
    
    try {
      const result = await signup(formData);
      
      if (result.success) {
        // Show success message and redirect to verification page
        navigate('/verify-email-sent', { 
          state: { 
            email: formData.email,
            message: 'Registration successful! Please check your email to verify your account.'
          }
        });
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
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
          <Title>Join Our Fleet</Title>
          <Subtitle>Create your naval command account</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <InputRow>
            <InputGroup>
              <Label htmlFor="firstName">First Name</Label>
              <InputWrapper>
                <InputIcon 
                  error={errors.firstName}
                  valid={validFields.firstName}
                  focused={focusedField === 'firstName'}
                >
                  <FaUser />
                </InputIcon>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('firstName')}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  valid={validFields.firstName}
                  focused={focusedField === 'firstName'}
                  required
                />
                {validFields.firstName && (
                  <ValidationIcon valid={true}>
                    <FaCheck />
                  </ValidationIcon>
                )}
              </InputWrapper>
              {errors.firstName && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaTimes />
                  {errors.firstName}
                </ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <InputWrapper>
                <InputIcon 
                  error={errors.lastName}
                  valid={validFields.lastName}
                  focused={focusedField === 'lastName'}
                >
                  <FaUser />
                </InputIcon>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('lastName')}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  valid={validFields.lastName}
                  focused={focusedField === 'lastName'}
                  required
                />
                {validFields.lastName && (
                  <ValidationIcon valid={true}>
                    <FaCheck />
                  </ValidationIcon>
                )}
              </InputWrapper>
              {errors.lastName && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaTimes />
                  {errors.lastName}
                </ErrorMessage>
              )}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon 
                error={errors.email}
                valid={validFields.email}
                focused={focusedField === 'email'}
              >
                <FaEnvelope />
              </InputIcon>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                error={errors.email}
                valid={validFields.email}
                focused={focusedField === 'email'}
                required
              />
              {emailCheckLoading && (
                <ValidationIcon>
                  <FaSpinner className="fa-spin" />
                </ValidationIcon>
              )}
              {!emailCheckLoading && validFields.email && (
                <ValidationIcon valid={true}>
                  <FaCheck />
                </ValidationIcon>
              )}
              {!emailCheckLoading && errors.email && (
                <ValidationIcon valid={false}>
                  <FaTimes />
                </ValidationIcon>
              )}
            </InputWrapper>
            {errors.email && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.email}
              </ErrorMessage>
            )}
            {validFields.email && !errors.email && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaCheck />
                Email is available
              </SuccessMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon 
                error={errors.password}
                valid={validFields.password}
                focused={focusedField === 'password'}
              >
                <FaLock />
              </InputIcon>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                error={errors.password}
                valid={validFields.password}
                focused={focusedField === 'password'}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                hasValidation={validFields.password}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
              {validFields.password && (
                <ValidationIcon valid={true}>
                  <FaCheck />
                </ValidationIcon>
              )}
            </InputWrapper>
            
            {formData.password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill 
                    strength={passwordStrength}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </StrengthBar>
                <StrengthText strength={passwordStrength}>
                  {getStrengthText(passwordStrength)}
                </StrengthText>
                <StrengthRequirements>
                  {getPasswordRequirements(formData.password).map((req, index) => (
                    <Requirement key={index} met={req.met}>
                      {req.met ? <FaCheck /> : <FaTimes />}
                      {req.text}
                    </Requirement>
                  ))}
                </StrengthRequirements>
              </PasswordStrength>
            )}
            
            {errors.password && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.password}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon 
                error={errors.confirmPassword}
                valid={validFields.confirmPassword}
                focused={focusedField === 'confirmPassword'}
              >
                <FaLock />
              </InputIcon>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                valid={validFields.confirmPassword}
                focused={focusedField === 'confirmPassword'}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                hasValidation={validFields.confirmPassword}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
              {validFields.confirmPassword && (
                <ValidationIcon valid={true}>
                  <FaCheck />
                </ValidationIcon>
              )}
            </InputWrapper>
            {errors.confirmPassword && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.confirmPassword}
              </ErrorMessage>
            )}
            {validFields.confirmPassword && !errors.confirmPassword && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaCheck />
                Passwords match
              </SuccessMessage>
            )}
          </InputGroup>

          {errors.submit && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaTimes />
              {errors.submit}
            </ErrorMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={isLoading || !Object.values(validFields).every(v => v)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && <FaSpinner className="fa-spin" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginLink>
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </LoginLink>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default EnhancedSignUp;