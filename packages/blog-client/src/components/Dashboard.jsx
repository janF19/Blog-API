// packages/blog-client/src/components/Dashboard.jsx
// This is an example of a protected component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import { Navigate } from 'react-router-dom';
import PostList from './PostList';

import userService from '../services/userService';


function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await userService.getUserProfile();
        setUserProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If still loading, show a loading state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        {userProfile && (
          <>
            <h2 className="text-xl mb-4">Welcome, {userProfile.name}!</h2>
            <div className="grid gap-4">
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
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;