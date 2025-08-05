import React, { useState, useEffect, useRef } from 'react';
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
  FaEyeSlash 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../../utils/validators';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCamera, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaAnchor,
  FaShield,
  FaBell,
  FaGlobe,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateName, validatePassword } from '../../utils/validators';
import PropTypes from 'prop-types';

const ProfileContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const ProfileHeader = styled(motion.div)`
  background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="1"/></g></g></svg>');
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const ProfileAvatar = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src}) center/cover` : 'linear-gradient(45deg, #fbbf24, #f59e0b)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #1a365d;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fbbf24;
  border: 3px solid white;
  color: #1a365d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f59e0b;
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const UserTitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const UserStats = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
  }

  .label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a365d;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const EditButton = styled(motion.button)`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? '#dc3545' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#dc3545' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #374151;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled(motion.div)`
  color: #16a34a;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;

  .title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .description {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const Toggle = styled.input`
  appearance: none;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;

  &:checked {
    background: #2563eb;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s ease;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

const UserProfile = () => {
  const { user, updateProfile, updatePassword, updateAvatar } = useAuth();
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: true,
    twoFactorAuth: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server or cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        updateAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (editingSection === 'personal') {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.message;
      }

      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message;
      }
    }

    if (editingSection === 'password') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.message;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setIsLoading(true);
    setSuccess('');

    try {
      if (editingSection === 'personal') {
        await updateProfile({
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          location: formData.location
        });
        setSuccess('Profile updated successfully!');
      } else if (editingSection === 'password') {
        await updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        setSuccess('Password updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
      
      setEditingSection(null);
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ProfileWrapper>
        <ProfileHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ProfileAvatar>
            <AvatarContainer>
              <Avatar src={user?.avatar}>
                {!user?.avatar && <FaUser />}
              </Avatar>
              <AvatarUpload onClick={() => fileInputRef.current?.click()}>
                <FaCamera />
              </AvatarUpload>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </AvatarContainer>
            <UserInfo>
              <UserName>{user?.name || 'Naval Officer'}</UserName>
              <UserTitle>Maritime Operations Specialist</UserTitle>
              <UserStats>
                <StatItem>
                  <span className="number">156</span>
                  <span className="label">Missions</span>
                </StatItem>
                <StatItem>
                  <span className="number">24</span>
                  <span className="label">Vessels</span>
                </StatItem>
                <StatItem>
                  <span className="number">8</span>
                  <span className="label">Years</span>
                </StatItem>
              </UserStats>
            </UserInfo>
          </ProfileAvatar>
        </ProfileHeader>

        <ProfileContent>
          <MainContent>
            {/* Personal Information Section */}
            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FaUser />
                  Personal Information
                </SectionTitle>
                <EditButton
                  onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingSection === 'personal' ? <FaTimes /> : <FaEdit />}
                  {editingSection === 'personal' ? 'Cancel' : 'Edit'}
                </EditButton>
              </SectionHeader>

              {editingSection === 'personal' ? (
                <Form onSubmit={handleSubmit}>
                  <InputGroup>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    {errors.name && (
                      <ErrorMessage
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.name}
                      </ErrorMessage>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                    {errors.email && (
                      <ErrorMessage
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.email}
                      </ErrorMessage>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Naval Base San Diego"
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label htmlFor="bio">Bio</Label>
                    <TextArea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about your naval experience..."
                    />
                  </InputGroup>

                  {success && (
                    <SuccessMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {success}
                    </SuccessMessage>
                  )}

                  {errors.submit && (
                    <ErrorMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.submit}
                    </ErrorMessage>
                  )}

                  <ButtonGroup>
                    <Button
                      type="submit"
                      className="primary"
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
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      className="secondary"
                      onClick={cancelEdit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </Form>
              ) : (
                <div>
                  <InputGroup>
                    <Label>Full Name</Label>
                    <Input value={user?.name || 'Not provided'} disabled />
                  </InputGroup>
                  <InputGroup>
                    <Label>Email Address</Label>
                    <Input value={user?.email || 'Not provided'} disabled />
                  </InputGroup>
                  <InputGroup>
                    <Label>Location</Label>
                    <Input value={user?.location || 'Not provided'} disabled />
                  </InputGroup>
                  <InputGroup>
                    <Label>Bio</Label>
                    <TextArea value={user?.bio || 'No bio provided'} disabled />
                  </InputGroup>
                </div>
              )}
            </Section>

            {/* Security Section */}
            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FaLock />
                  Security Settings
                </SectionTitle>
                <EditButton
                  onClick={() => setEditingSection(editingSection === 'password' ? null : 'password')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingSection === 'password' ? <FaTimes /> : <FaEdit />}
                  Change Password
                </EditButton>
              </SectionHeader>

              <AnimatePresence>
                {editingSection === 'password' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form onSubmit={handleSubmit}>
                      <InputGroup>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <PasswordInput>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            error={errors.currentPassword}
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                          </PasswordToggle>
                        </PasswordInput>
                        {errors.currentPassword && (
                          <ErrorMessage
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {errors.currentPassword}
                          </ErrorMessage>
                        )}
                      </InputGroup>

                      <InputGroup>
                        <Label htmlFor="newPassword">New Password</Label>
                        <PasswordInput>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            error={errors.newPassword}
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                          </PasswordToggle>
                        </PasswordInput>
                        {errors.newPassword && (
                          <ErrorMessage
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {errors.newPassword}
                          </ErrorMessage>
                        )}
                      </InputGroup>

                      <InputGroup>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <PasswordInput>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                          </PasswordToggle>
                        </PasswordInput>
                        {errors.confirmPassword && (
                          <ErrorMessage
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {errors.confirmPassword}
                          </ErrorMessage>
                        )}
                      </InputGroup>

                      {success && (
                        <SuccessMessage
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {success}
                        </SuccessMessage>
                      )}

                      {errors.submit && (
                        <ErrorMessage
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {errors.submit}
                        </ErrorMessage>
                      )}

                      <ButtonGroup>
                        <Button
                          type="submit"
                          className="primary"
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
                          Update Password
                        </Button>
                        <Button
                          type="button"
                          className="secondary"
                          onClick={cancelEdit}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          </MainContent>

          <Sidebar>
            {/* Account Settings */}
            <Section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <SectionTitle>
                <FaBell />
                Preferences
              </SectionTitle>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Email Notifications</div>
                  <div className="description">Receive mission updates via email</div>
                </SettingInfo>
                <Toggle
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                />
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Push Notifications</div>
                  <div className="description">Get real-time alerts on your device</div>
                </SettingInfo>
                <Toggle
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleSettingChange('pushNotifications')}
                />
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Profile Visibility</div>
                  <div className="description">Make your profile visible to other officers</div>
                </SettingInfo>
                <Toggle
                  type="checkbox"
                  checked={settings.profileVisibility}
                  onChange={() => handleSettingChange('profileVisibility')}
                />
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Two-Factor Authentication</div>
                  <div className="description">Add an extra layer of security</div>
                </SettingInfo>
                <Toggle
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={() => handleSettingChange('twoFactorAuth')}
                />
              </SettingItem>
            </Section>

            {/* Quick Stats */}
            <Section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SectionTitle>
                <FaShield />
                Account Status
              </SectionTitle>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Account Type</div>
                  <div className="description">Active Service Member</div>
                </SettingInfo>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Last Login</div>
                  <div className="description">Today at 14:30</div>
                </SettingInfo>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <div className="title">Security Score</div>
                  <div className="description">85/100 - Good</div>
                </SettingInfo>
              </SettingItem>
            </Section>
          </Sidebar>
        </ProfileContent>
      </ProfileWrapper>
    </ProfileContainer>
  );
};

export default UserProfile;