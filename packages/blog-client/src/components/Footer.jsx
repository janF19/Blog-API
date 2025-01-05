// packages/blog-client/src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Blog Platform. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;