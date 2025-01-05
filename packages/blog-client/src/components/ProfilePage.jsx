import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import PostList from './PostList';

function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await userService.getUserProfile();
        setUserProfile(profileData);
        setEditedProfile({
          name: profileData.name,
          email: profileData.email,
          password: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that have changed
      const updateData = {};
      if (editedProfile.name !== userProfile.name) {
        updateData.name = editedProfile.name;
      }
      if (editedProfile.email !== userProfile.email) {
        updateData.email = editedProfile.email;
      }
      if (editedProfile.password) {
        updateData.password = editedProfile.password;
      }

      const updatedProfile = await userService.updateUserProfile(updateData);
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      // Handle error (perhaps set an error state to show to user)
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={editedProfile.password}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Details</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <strong>Name:</strong> {userProfile.name}
              </div>
              <div>
                <strong>Email:</strong> {userProfile.email}
              </div>
              <div>
                <strong>Role:</strong> {userProfile.role}
              </div>
              <div>
                <strong>Total Comments:</strong> {userProfile._count.comments}
              </div>
            </div>
          </>
        )}
        
        
      </div>
    </div>
  );
}

export default ProfilePage;