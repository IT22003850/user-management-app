import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to User App</h1>
      <p className="text-lg text-gray-600 mb-6">
        Manage your profile, connect with others, and explore user details.
      </p>
      <a 
        href="/register" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </a>
    </div>
  );
};

export default Home;