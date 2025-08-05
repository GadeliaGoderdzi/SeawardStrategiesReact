import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaShip, 
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../../utils/validators';
import ProductSignUp from '../forms/ProductSignUp';
import PropTypes from 'prop-types';

const DashboardContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
  color: white;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="1.5"/></g></g></svg>');
    animation: float 20s infinite linear;
    z-index: 0;
  }
  
  @keyframes float {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const EditButton = styled(motion.button)`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(37, 99, 235, 0.1);
  }
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
  background: ${props => props.disabled ? '#f8fafc' : 'white'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#dc3545' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    color: #6b7280;
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

const InfoDisplay = styled.div`
  padding: 1rem 1rem 1rem 3rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  position: relative;
`;

const ErrorMessage = styled(motion.div)`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductItem = styled(motion.div)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProductIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const ProductTier = styled.span`
  display: inline-block;
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  text-transform: uppercase;
`;

const ProductDate = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  
  p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const AddProductButton = styled(motion.button)`
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoutButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  transition: all 0.3s ease;
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

const UserProfileDashboard = () => {
  const { user, logout, updateProfile, apiCall } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showProductSignup, setShowProductSignup] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '', 
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    const firstNameValidation = validateName(profileData.firstName);
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.message;
    }

    const lastNameValidation = validateName(profileData.lastName);
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.message;
    }

    const emailValidation = validateEmail(profileData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setIsLoading(true);
    
    try {
      await apiCall('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      setEditingProfile(false);
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    
    try {
      await apiCall('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setEditingPassword(false);
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Failed to update password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProductSignupSuccess = (productData) => {
    setShowProductSignup(false);
    // The user data should be automatically updated through the auth context
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  if (showProductSignup) {
    return (
      <ProductSignUp
        onSuccess={handleProductSignupSuccess}
        onCancel={() => setShowProductSignup(false)}
      />
    );
  }

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <HeaderContent>
          <WelcomeTitle>Welcome back, {user.firstName || user.name}!</WelcomeTitle>
          <WelcomeSubtitle>Manage your profile and maritime subscriptions</WelcomeSubtitle>
        </HeaderContent>
      </Header>

      <Grid>
        {/* User Information Card */}
        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle>
              <FaUser />
              User Information
            </CardTitle>
            <EditButton
              onClick={() => setEditingProfile(!editingProfile)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editingProfile ? <FaTimes /> : <FaEdit />}
            </EditButton>
          </CardHeader>

          {editingProfile ? (
            <Form onSubmit={handleProfileSave}>
              <InputGroup>
                <Label htmlFor="firstName">First Name</Label>
                <InputWrapper>
                  <InputIcon><FaUser /></InputIcon>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    error={errors.firstName}
                    required
                  />
                </InputWrapper>
                {errors.firstName && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.firstName}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <InputWrapper>
                  <InputIcon><FaUser /></InputIcon>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    error={errors.lastName}
                    required
                  />
                </InputWrapper>
                {errors.lastName && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.lastName}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <InputIcon><FaEnvelope /></InputIcon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={errors.email}
                    required
                  />
                </InputWrapper>
                {errors.email && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.email}
                  </ErrorMessage>
                )}
              </InputGroup>

              <ButtonGroup>
                <SaveButton
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
                  <FaSave />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </SaveButton>
                <CancelButton
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || ''
                    });
                    setErrors({});
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </Form>
          ) : (
            <div>
              <InputGroup>
                <Label>Name</Label>
                <InputWrapper>
                  <InputIcon><FaUser /></InputIcon>
                  <InfoDisplay>{user.name || `${user.firstName} ${user.lastName}` || 'Not provided'}</InfoDisplay>
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Email Address</Label>
                <InputWrapper>
                  <InputIcon><FaEnvelope /></InputIcon>
                  <InfoDisplay>{user.email}</InfoDisplay>
                </InputWrapper>
              </InputGroup>
            </div>
          )}
        </Card>

        {/* Profile Edit Section (Password) */}
        <Card
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle>
              <FaLock />
              Update Password
            </CardTitle>
            <EditButton
              onClick={() => setEditingPassword(!editingPassword)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editingPassword ? <FaTimes /> : <FaEdit />}
            </EditButton>
          </CardHeader>

          {editingPassword ? (
            <Form onSubmit={handlePasswordSave}>
              <InputGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={errors.currentPassword}
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </InputWrapper>
                {errors.currentPassword && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.currentPassword}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </InputWrapper>
                {errors.newPassword && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.newPassword}
                  </ErrorMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                    required
                  />
                </InputWrapper>
                {errors.confirmPassword && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaTimes />
                    {errors.confirmPassword}
                  </ErrorMessage>
                )}
              </InputGroup>

              <ButtonGroup>
                <SaveButton
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
                  <FaSave />
                  {isLoading ? 'Updating...' : 'Update Password'}
                </SaveButton>
                <CancelButton
                  type="button"
                  onClick={() => {
                    setEditingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setErrors({});
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </Form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Click the edit button to change your password
              </p>
              <FaLock style={{ fontSize: '2rem', color: '#e2e8f0' }} />
            </div>
          )}
        </Card>
      </Grid>

      {/* Product Subscriptions Card */}
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CardHeader>
          <CardTitle>
            <FaShip />
            Product Subscriptions
          </CardTitle>
        </CardHeader>

        {user.products && user.products.length > 0 ? (
          <ProductsList>
            <AnimatePresence>
              {user.products.map((product, index) => (
                <ProductItem
                  key={`${product.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductIcon>
                    <FaShip />
                  </ProductIcon>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductTier>{product.tier}</ProductTier>
                    <ProductDate>
                      Subscribed on {formatDate(product.signupDate)}
                    </ProductDate>
                  </ProductInfo>
                </ProductItem>
              ))}
            </AnimatePresence>
          </ProductsList>
        ) : (
          <NoProducts>
            <p>You haven't subscribed to any products yet.</p>
            <AddProductButton
              onClick={() => setShowProductSignup(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              Browse Products
            </AddProductButton>
          </NoProducts>
        )}
      </Card>

      {/* Global Error Messages */}
      {errors.submit && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '1rem', justifyContent: 'center' }}
        >
          <FaTimes />
          {errors.submit}
        </ErrorMessage>
      )}

      {/* Logout Button */}
      <LogoutButton
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaSignOutAlt />
        Logout
      </LogoutButton>
    </DashboardContainer>
  );
};

UserProfileDashboard.propTypes = {};

export default UserProfileDashboard;