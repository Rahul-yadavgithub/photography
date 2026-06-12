import React from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
          <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-widest">Loading Session...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Preserve the intended path to redirect back after sign in
    return <RedirectToSignIn redirectUrl={location.pathname + location.search} />;
  }

  return children;
};

export default ProtectedRoute;
