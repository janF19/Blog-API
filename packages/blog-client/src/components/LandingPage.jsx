import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BlogApp
            </Link>
            <div className="flex gap-4">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with prominent CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to Your</span>
            <span className="block text-blue-600">Blog Platform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our community to start sharing your stories
          </p>

          {/* Large CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-6">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="rounded-md bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-lg hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Get Started - Register Now
                </Link>
                <Link
                  to="/login"
                  className="rounded-md bg-white px-8 py-4 text-xl font-semibold text-blue-600 shadow-lg ring-1 ring-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Already have an account? Login
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="rounded-md bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-lg hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-200"
              >
                Go to Your Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Read Stories</h3>
            <p className="text-gray-600">Discover interesting articles from our community.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Write Posts</h3>
            <p className="text-gray-600">Share your thoughts with the world.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Join Community</h3>
            <p className="text-gray-600">Connect with other writers and readers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;