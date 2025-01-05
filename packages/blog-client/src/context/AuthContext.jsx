// packages/blog-client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getCurrentUser();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      // Instead of using navigate, we'll use window.location
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};