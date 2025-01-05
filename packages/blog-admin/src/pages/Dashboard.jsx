// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiLogOut } from 'react-icons/fi';
import CommentsSection from '../components/CommentSection';
import toast from 'react-hot-toast';

function Dashboard() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', published: false });
  const [isEditing, setIsEditing] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });
  

  // Update mutation calls
const createMutation = useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      resetForm();
      toast.success('Post created successfully');
    },
    onError: (error) => {
      console.error('Create mutation error:', error);
      toast.error(error.response?.data?.error || 'Failed to create post');
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data) => updatePost(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      resetForm();
      toast.success('Post updated successfully');
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete post');
    }
  });

 
// Update form submission
const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      title: currentPost.title,
      content: currentPost.content,
      published: currentPost.published
    };
  
    if (isEditing) {
      updateMutation.mutate({
        id: currentPost.id,
        ...postData
      });
    } else {
      createMutation.mutate(postData);
    }
  };

  const resetForm = () => {
    setCurrentPost({ title: '', content: '', published: false });
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Blog Admin Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>

        {/* Post Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Post Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={currentPost.title}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Post Content"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                rows="6"
                value={currentPost.content}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={currentPost.published}
                  onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                />
                <span className="text-gray-700">Published</span>
              </label>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Posts List</h2>
            <div className="divide-y divide-gray-200">
              {posts?.map((post, index) => (
                <div key={post.id} className="group">
                  <div className={`${index !== 0 ? 'pt-8' : ''}`}>
                    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200">
                      <div className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            {post.published ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Draft
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setCurrentPost(post);
                              setIsEditing(true);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this post?')) {
                                deleteMutation.mutate(post.id);
                              }
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-8">
                      <CommentsSection postId={post.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;