import axios from './axios';

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user profile
  getProfile: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axios.put('/auth/updateprofile', userData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await axios.put('/auth/updatepassword', passwords);
    return response.data;
  },
};
