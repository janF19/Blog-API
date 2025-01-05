import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import userService from '../services/userService';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Blog</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile" className="hover:text-gray-300">
                {user?.name || user?.email || 'Profile'}
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : ( 
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;