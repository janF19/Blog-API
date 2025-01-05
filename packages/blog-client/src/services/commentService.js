
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/comments';

const commentService = {
  async getCommentsByPostId(postId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/comments/post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Comments for post:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comments:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async createComment(commentData) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.post(API_URL, commentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Created comment:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create comment:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async updateComment(commentId, commentData) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.put(`${API_URL}/${commentId}`, commentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Updated comment:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update comment:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async deleteComment(commentId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.delete(`${API_URL}/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Deleted comment:', commentId);
      return response.data;
    } catch (error) {
      console.error('Failed to delete comment:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
};

export default commentService;