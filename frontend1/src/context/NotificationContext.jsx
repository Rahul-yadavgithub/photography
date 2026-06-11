import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(({ type, message }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const showSuccess = useCallback((message) => {
    showNotification({ type: 'success', message });
  }, [showNotification]);

  const showError = useCallback((message) => {
    showNotification({ type: 'error', message });
  }, [showNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[300px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border 
              animate-in slide-in-from-top-2 fade-in duration-300
              ${notification.type === 'success' ? 'border-emerald-100' : 'border-red-100'}
            `}
          >
            {notification.type === 'success' ? (
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            )}
            
            <p className="flex-1 text-sm font-semibold text-zinc-800">
              {notification.message}
            </p>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
