import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a24] text-white p-4">
      <div className="text-center glass-card p-12 max-w-lg w-full">
        <h1 className="text-6xl font-extrabold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-block w-auto px-8">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
