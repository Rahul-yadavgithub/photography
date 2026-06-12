import React, { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const SessionTimeoutManager = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    // Only track timeout if the user is authenticated
    if (!isLoaded || !isSignedIn) return;

    const handleActivity = () => {
      resetTimer();
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(handleTimeout, TIMEOUT_DURATION);
    };

    const handleTimeout = () => {
      console.log("Session expired due to inactivity.");
      // Sign out and redirect to current page (which ProtectedRoute will then redirect to sign-in)
      signOut({ redirectUrl: location.pathname + location.search });
    };

    // Attach listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoaded, isSignedIn, signOut, location.pathname, location.search]);

  // This component doesn't render anything
  return null;
};

export default SessionTimeoutManager;
