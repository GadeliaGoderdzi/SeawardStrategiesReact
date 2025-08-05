import apiService from './api';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async logout() {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        return response.token;
      }
    } catch (error) {
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();