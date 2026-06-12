import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingPaused, setIsBookingPaused] = useState(false);
  const [initialPackage, setInitialPackage] = useState(null);
  
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    mobile: '',
    enquiryType: '',
    packageId: null,
    packageName: '',
    selectedPackageSnapshot: null,
    eventDate: null,
    eventLocation: '',
    notes: '',
    specialInstructions: '',
    extraRequirements: '',
    advancePlan: null,
    advancePercentage: 0,
    selectedBenefits: []
  });

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const openBookingFlow = (pkg = null) => {
    if (pkg) setInitialPackage(pkg);
    setIsBookingOpen(true);
    setIsBookingPaused(false);
  };

  const pauseBookingFlow = () => {
    setIsBookingOpen(false);
    setIsBookingPaused(true);
  };

  const closeBookingFlow = () => {
    setIsBookingOpen(false);
    setIsBookingPaused(false);
    setTimeout(() => {
      setInitialPackage(null);
      setStep(0);
      setBookingData({
        name: '',
        email: '',
        mobile: '',
        enquiryType: '',
        packageId: null,
        packageName: '',
        selectedPackageSnapshot: null,
        eventDate: null,
        eventLocation: '',
        notes: '',
        specialInstructions: '',
        extraRequirements: '',
        advancePlan: null,
        advancePercentage: 0,
        selectedBenefits: []
      });
    }, 500);
  };

  return (
    <BookingContext.Provider 
      value={{ 
        isBookingOpen, 
        isBookingPaused,
        openBookingFlow, 
        pauseBookingFlow,
        closeBookingFlow, 
        initialPackage,
        step,
        setStep,
        bookingData,
        updateBookingData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
