import React from 'react';

const AuthError = () => {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black flex items-center justify-center">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-800">Authentication Error</h2>
        <p className="mb-4 text-red-600">
          You need to be logged in to access this page. Please log in and try again.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default AuthError;