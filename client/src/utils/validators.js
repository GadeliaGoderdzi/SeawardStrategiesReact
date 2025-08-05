import { FORM_VALIDATION } from './constants';

// Simple boolean validators for direct use in components
export const validateEmail = (email) => {
  if (!email) return false;
  return FORM_VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;
  if (password.length < FORM_VALIDATION.PASSWORD_MIN_LENGTH) return false;
  // Strong password: at least 8 chars, uppercase, lowercase, number, special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return strongPasswordRegex.test(password);
};

export const validateName = (name) => {
  if (!name) return false;
  if (name.length < FORM_VALIDATION.NAME_MIN_LENGTH) return false;
  return true;
};

// Detailed validators that return objects (for complex form validation)
export const validateEmailDetailed = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!FORM_VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

export const validatePasswordDetailed = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < FORM_VALIDATION.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN_LENGTH} characters long` 
    };
  }
  
  return { isValid: true, message: '' };
};

export const validateNameDetailed = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.length < FORM_VALIDATION.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Name must be at least ${FORM_VALIDATION.NAME_MIN_LENGTH} characters long` 
    };
  }
  
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: '' };
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, value] of Object.entries(formData)) {
    if (rules[field]) {
      const result = rules[field](value, formData);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
};