// src/services/commentService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/comments',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const commentService = {
  // Get comments for a specific post
  async getCommentsByPostId(postId) {
    try {
      const response = await api.get(`/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Create a new comment
  async createComment(data) {
    try {
      const response = await api.post('/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Update a comment
  async updateComment(id, content) {
    try {
      const response = await api.put(`/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(id) {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService;