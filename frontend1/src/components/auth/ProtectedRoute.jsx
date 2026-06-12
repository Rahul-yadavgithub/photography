import React from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-widest">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Pass the current location so they return here after signing in
    return <RedirectToSignIn redirectUrl={location.pathname + location.search} />;
  }

  return children;
};

export default ProtectedRoute;
