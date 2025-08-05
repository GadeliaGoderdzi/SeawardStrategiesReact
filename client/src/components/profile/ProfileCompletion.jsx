import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUser, 
  FaPhone, 
  FaEdit, 
  FaCamera, 
  FaCheck, 
  FaTimes,
  FaSpinner,
  FaUpload,
  FaTrash
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
  max-width: 600px;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 2rem 0;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src}) center/cover` : 'linear-gradient(45deg, #fbbf24, #f59e0b)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${props => props.src ? 'transparent' : '#1a365d'};
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

const AvatarOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const AvatarButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const AvatarButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  background: transparent;
  color: #2563eb;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    color: white;
  }

  &.danger {
    border-color: #dc3545;
    color: #dc3545;

    &:hover {
      background: #dc3545;
      color: white;
    }
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 1rem;
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

const TextArea = styled.textarea`
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
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

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
  top: ${props => props.textarea ? '1rem' : '50%'};
  transform: ${props => props.textarea ? 'none' : 'translateY(-50%)'};
`;

const ValidationIcon = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.valid ? '#28a745' : '#dc3545'};
  font-size: 1.1rem;
  z-index: 2;
  top: ${props => props.textarea ? '1rem' : '50%'};
  transform: ${props => props.textarea ? 'none' : 'translateY(-50%)'};
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: ${props => props.over ? '#dc3545' : '#64748b'};
  margin-top: 0.25rem;
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

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

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

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    phone: '',
    bio: ''
  });
  
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.trim())) return 'Please enter a valid phone number';
        return '';
      
      case 'bio':
        if (!value.trim()) return 'Bio is required';
        if (value.trim().length < 10) return 'Bio must be at least 10 characters';
        if (value.length > 500) return 'Bio cannot exceed 500 characters';
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

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image must be less than 5MB' }));
        return;
      }

      setAvatar(file);
      setErrors(prev => ({ ...prev, avatar: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const uploadAvatar = async () => {
    if (!avatar) return null;

    setUploadingAvatar(true);
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', avatar);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (response.ok) {
        return data.avatarUrl;
      } else {
        throw new Error(data.message || 'Avatar upload failed');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setErrors(prev => ({ ...prev, avatar: error.message }));
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Upload avatar first if selected
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl && errors.avatar) {
          setIsLoading(false);
          return;
        }
      }

      // Complete profile
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth context with new user data
        if (updateProfile) {
          updateProfile(data.user);
        }
        
        navigate('/dashboard', { 
          state: { 
            message: 'Profile completed successfully! Welcome to your dashboard.',
            showWelcome: true
          }
        });
      } else {
        throw new Error(data.message || 'Profile completion failed');
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Profile completion failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    let completed = 0;
    const total = 3; // phone, bio, avatar (optional but counts)
    
    if (formData.phone && !errors.phone) completed++;
    if (formData.bio && !errors.bio) completed++;
    if (avatar || avatarPreview) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : user.name.charAt(0).toUpperCase();
    }
    return 'U';
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
        <Header>
          <Title>Complete Your Profile</Title>
          <Subtitle>
            Just a few more details to get you started. This information helps us 
            provide a better experience and allows other users to connect with you.
          </Subtitle>
        </Header>

        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>
        
        <ProgressText>
          Profile Completion: {getProgressPercentage()}%
        </ProgressText>

        <Form onSubmit={handleSubmit}>
          <AvatarSection>
            <AvatarContainer>
              <Avatar src={avatarPreview}>
                {!avatarPreview && getUserInitials()}
                <AvatarOverlay
                  whileHover={{ opacity: 1 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCamera />
                </AvatarOverlay>
              </Avatar>
            </AvatarContainer>
            
            <AvatarButtons>
              <AvatarButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? <FaSpinner className="fa-spin" /> : <FaUpload />}
                {avatar ? 'Change Photo' : 'Upload Photo'}
              </AvatarButton>
              
              {(avatar || avatarPreview) && (
                <AvatarButton
                  type="button"
                  className="danger"
                  onClick={handleAvatarRemove}
                >
                  <FaTrash />
                  Remove
                </AvatarButton>
              )}
            </AvatarButtons>
            
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
            />
            
            {errors.avatar && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.avatar}
              </ErrorMessage>
            )}
          </AvatarSection>

          <InputGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <InputWrapper>
              <InputIcon 
                error={errors.phone}
                valid={validFields.phone}
                focused={focusedField === 'phone'}
              >
                <FaPhone />
              </InputIcon>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={() => handleFocus('phone')}
                onBlur={handleBlur}
                error={errors.phone}
                valid={validFields.phone}
                focused={focusedField === 'phone'}
                required
              />
              {validFields.phone && (
                <ValidationIcon valid={true}>
                  <FaCheck />
                </ValidationIcon>
              )}
            </InputWrapper>
            {errors.phone && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.phone}
              </ErrorMessage>
            )}
            {validFields.phone && !errors.phone && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaCheck />
                Phone number looks good!
              </SuccessMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="bio">About You</Label>
            <InputWrapper>
              <InputIcon 
                error={errors.bio}
                valid={validFields.bio}
                focused={focusedField === 'bio'}
                textarea={true}
              >
                <FaEdit />
              </InputIcon>
              <TextArea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself, your interests, and what you do..."
                value={formData.bio}
                onChange={handleInputChange}
                onFocus={() => handleFocus('bio')}
                onBlur={handleBlur}
                error={errors.bio}
                valid={validFields.bio}
                focused={focusedField === 'bio'}
                required
              />
              {validFields.bio && (
                <ValidationIcon valid={true} textarea={true}>
                  <FaCheck />
                </ValidationIcon>
              )}
            </InputWrapper>
            <CharCount over={formData.bio.length > 500}>
              {formData.bio.length} / 500 characters
            </CharCount>
            {errors.bio && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaTimes />
                {errors.bio}
              </ErrorMessage>
            )}
            {validFields.bio && !errors.bio && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaCheck />
                Great bio! This helps others get to know you.
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
            disabled={isLoading || !validFields.phone || !validFields.bio}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && <FaSpinner className="fa-spin" />}
            {isLoading ? 'Completing Profile...' : 'Complete Profile'}
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};

export default ProfileCompletion;