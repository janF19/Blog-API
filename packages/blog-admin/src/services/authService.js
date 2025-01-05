
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Starting Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.log('Error Response:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/login', credentials);
      console.log('Login response received:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        throw new Error(error.response.data.error || 'Authentication failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('Login request failed: ' + error.message);
      }
    }
  },

  getCurrentUser() {
    return localStorage.getItem('adminToken');
  },

  logout() {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default authService;