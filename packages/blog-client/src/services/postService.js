import axios from 'axios';

const API_URL = 'http://localhost:3000/api/posts';

const postService = {
    async getAllPosts() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        const response = await axios.get(`${API_URL}/published`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Posts response:', response.data);
        return response.data; // Directly return the array
      } catch (error) {
        console.error('Failed to fetch posts:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    },



    async getPostById(postId) {
      const token = localStorage.getItem('token');
    
      if (!token) {
        throw new Error('No authentication token found');
      }
    
      try {
        const response = await axios.get(`${API_URL}/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        console.log('Individual Post Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch individual post:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    }
  };

export default postService;