import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useBooking } from './BookingContext';
import { useNavigate, useLocation } from 'react-router-dom';

const IntentContext = createContext();

export const IntentProvider = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { openBookingFlow } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();
  const hasExecutedIntent = useRef(false);

  const executeProtectedAction = (actionType, metadata = null, customRedirectUrl = null) => {
    if (isSignedIn) {
      handleIntent(actionType, metadata);
    } else {
      const redirectPath = customRedirectUrl || window.location.pathname;
      // Save intent to localStorage to survive OAuth redirects
      localStorage.setItem('photography_pending_intent', JSON.stringify({
        actionType,
        targetRoute: redirectPath,
        metadata
      }));
      // Set redirectUrl so Clerk knows where to go after auth
      openSignIn({ forceRedirectUrl: redirectPath });
    }
  };

  const handleIntent = (actionType, metadata) => {
    switch (actionType) {
      case 'OPEN_BOOKING_FLOW':
        openBookingFlow(metadata);
        break;
      case 'NAVIGATE':
        if (metadata?.path) {
          navigate(metadata.path);
        }
        break;
      // Add more cases here in the future
      case 'SAVE_PACKAGE':
        console.log("Saving package (feature not implemented yet)", metadata);
        break;
      default:
        console.warn('Unknown intent actionType:', actionType);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasExecutedIntent.current) {
      const pendingIntentStr = localStorage.getItem('photography_pending_intent');
      if (pendingIntentStr) {
        hasExecutedIntent.current = true; // Prevent double execution
        
        try {
          const intent = JSON.parse(pendingIntentStr);
          
          // Background sync user to backend
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
          fetch(`${backendUrl}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || '',
              phone: user.primaryPhoneNumber?.phoneNumber || '',
              avatar: user.imageUrl || '',
            }),
          }).catch(err => console.error('Failed to sync user:', err));

          // Clear intent so it doesn't run again
          localStorage.removeItem('photography_pending_intent');

          // Ensure we are on the correct route before executing
          if (intent.targetRoute && intent.targetRoute !== location.pathname) {
             navigate(intent.targetRoute, { replace: true });
             // Short delay to allow route rendering before modal opens
             setTimeout(() => handleIntent(intent.actionType, intent.metadata), 200);
          } else {
             handleIntent(intent.actionType, intent.metadata);
          }
        } catch (err) {
          console.error("Error parsing intent", err);
          localStorage.removeItem('photography_pending_intent');
        }
      }
    }
  }, [isLoaded, isSignedIn, user, location.pathname, navigate, openBookingFlow]);

  // Reset execution ref if user signs out
  useEffect(() => {
    if (!isSignedIn) {
      hasExecutedIntent.current = false;
    }
  }, [isSignedIn]);

  return (
    <IntentContext.Provider value={{ executeProtectedAction }}>
      {children}
    </IntentContext.Provider>
  );
};

export const useIntent = () => {
  const context = useContext(IntentContext);
  if (!context) {
    throw new Error('useIntent must be used within an IntentProvider');
  }
  return context;
};
