import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialPackage, setInitialPackage] = useState(null);

  const openBookingFlow = (pkg = null) => {
    setInitialPackage(pkg);
    setIsBookingOpen(true);
  };

  const closeBookingFlow = () => {
    setIsBookingOpen(false);
    // don't immediately clear package to allow out-animation
    setTimeout(() => setInitialPackage(null), 300);
  };

  return (
    <BookingContext.Provider value={{ isBookingOpen, openBookingFlow, closeBookingFlow, initialPackage }}>
      {children}
    </BookingContext.Provider>
  );
};
