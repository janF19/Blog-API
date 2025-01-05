import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
  
    useEffect(() => {
      console.log('User in PostList:', user); // Debug user
      const fetchPosts = async () => {
        if (!user) {
          console.error('No user, cannot fetch posts');
          setLoading(false);
          return;
        }
    
        try {
          console.log('Attempting to fetch posts with token:', localStorage.getItem('token'));
          const response = await postService.getAllPosts();
          console.log('Detailed posts response:', response);
          
          if (Array.isArray(response)) {
            setPosts(response);
          } else {
            console.error('Unexpected response format:', response);
            setPosts([]);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Detailed fetch posts error:', {
            message: error.message,
            response: error.response,
            stack: error.stack
          });
          setError(error.message || 'Failed to fetch posts');
          setLoading(false);
        }
      };
    
      fetchPosts();
    }, [user]);
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!posts || posts.length === 0) return <div>No posts found</div>;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold mb-3 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
}

export default PostList;