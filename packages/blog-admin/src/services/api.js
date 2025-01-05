// src/services/api.js
// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false,  // Change this to false initially
    timeout: 15000
  });

// Add request logging
api.interceptors.request.use(
  (config) => {
    console.log('Outgoing Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Enhanced error handling in interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request details:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
}, (error) => {
  return Promise.reject(error);
});






export const getPosts = async () => {
  const response = await api.get('/posts/all');
  return response.data;
};

// Update your API functions to handle data correctly
export const createPost = async (postData) => {
  console.log('Creating post with data:', postData);
  try {
    const response = await api.post('/posts', postData); // Remove trailing slash
    return response.data;
  } catch (error) {
    console.error('Create post error:', error.response?.data);
    throw error;
  }
};

export const updatePost = async (id, data) => {
  console.log('Updating post:', { id, data });
  try {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update post error:', error.response?.data);
    throw error;
  }
};

export const deletePost = async (id) => {
  console.log('Deleting post:', id);
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete post error:', error.response?.data);
    throw error;
  }
};