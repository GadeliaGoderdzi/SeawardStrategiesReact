const validator = require('validator');

// Email validation
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  
  return { isValid: true };
};

// Name validation
const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: `${fieldName} cannot exceed 50 characters` };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

// Phone validation
const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

// Bio validation
const validateBio = (bio) => {
  if (!bio) {
    return { isValid: true }; // Bio is optional
  }
  
  if (bio.length > 500) {
    return { isValid: false, message: 'Bio cannot exceed 500 characters' };
  }
  
  return { isValid: true };
};

// User registration validation
const validateUserRegistration = (userData) => {
  const errors = {};
  
  const firstNameValidation = validateName(userData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message;
  }
  
  const lastNameValidation = validateName(userData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message;
  }
  
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Profile update validation
const validateProfileUpdate = (profileData) => {
  const errors = {};
  
  if (profileData.firstName) {
    const firstNameValidation = validateName(profileData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.message;
    }
  }
  
  if (profileData.lastName) {
    const lastNameValidation = validateName(profileData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.message;
    }
  }
  
  if (profileData.phone) {
    const phoneValidation = validatePhone(profileData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  if (profileData.bio) {
    const bioValidation = validateBio(profileData.bio);
    if (!bioValidation.isValid) {
      errors.bio = bioValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateBio,
  validateUserRegistration,
  validateProfileUpdate
};