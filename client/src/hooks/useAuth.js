import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      verifyToken(token);
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      setLoading(true);
      // API call to verify token
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user || userData);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      console.log('useAuth signup called with:', userData);
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      console.log('Signup API response:', response.status);

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/product-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        throw new Error(data.message || 'Product signup failed');
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message || 'Product signup failed');
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        throw new Error(data.message || 'Password update failed');
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message || 'Password update failed');
    }
  };

  const updateAvatar = async (avatarData) => {
    try {
      setUser(prev => ({ ...prev, avatar: avatarData }));
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Avatar update failed');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    updateAvatar,
    addProduct,
    loading,
    isAuthenticated: !!user,
    verifyToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};