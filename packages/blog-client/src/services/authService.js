import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users'; // Updated to match backend routes

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(request => {
    console.log('Starting Request:', {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers
    });
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Response:', response);
      return response;
    },
    error => {
      console.log('Error Response:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return Promise.reject(error);
    }
  );


const authService = {
    async register(userData) {
        console.log('Registering user with data:', userData);
        try {
          const response = await api.post('/register', userData);
          console.log('Registration response:', response.data);
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
          return response.data;
        } catch (error) {
          console.error('Registration error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          throw this._handleError(error);
        }
      },

  async login(email, password) {
    try {
      console.log('Attempting login with:', { email, password });
      
      const response = await api.post('/login', {
        email: email,
        password: password
      });
      
      console.log('Login response received:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
        throw {
          message: error.response.data.error || 'Server error occurred',
          status: error.response.status
        };
      } else if (error.request) {
        throw {
          message: 'No response from server. Please check your connection.',
          status: 503
        };
      } else {
        throw {
          message: 'Error setting up request',
          status: 500
        };
      }
    }
  },

  logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  },

  _handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.error || 'An error occurred',
        status: error.response.status,
        details: error.response.data.details
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        status: 503
      };
    } else {
      // Request setup error
      return {
        message: 'Failed to make request',
        status: 500
      };
    }
  }
};

export default authService;