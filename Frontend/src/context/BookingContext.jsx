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
    selectedBenefits: [],
    basePrice: 0,
    selectedAddons: [],
    subtotal: 0,
    tax: 0,
    totalPrice: 0
  });

  const updateBookingData = (data) => {
    setBookingData((prev) => {
      const updated = { ...prev, ...data };
      
      // Auto-calculate totals if pricing data changes
      if (data.basePrice !== undefined || data.selectedAddons !== undefined) {
        const addonsTotal = (updated.selectedAddons || []).reduce((sum, a) => sum + (a.price || 0), 0);
        updated.subtotal = (updated.basePrice || 0) + addonsTotal;
        updated.tax = Math.round(updated.subtotal * 0.18); // Example: 18% GST. Can be updated dynamically if needed.
        updated.totalPrice = updated.subtotal + updated.tax;
      }
      
      return updated;
    });
  };

  const openBookingFlow = (metadata = null) => {
    if (metadata && metadata.packageId) {
      setInitialPackage(metadata);
      setBookingData(prev => ({
        ...prev,
        packageId: metadata.packageId,
        packageName: metadata.packageName || metadata.name,
        enquiryType: metadata.category || prev.enquiryType,
        basePrice: metadata.basePrice || metadata.price || 0,
        selectedAddons: metadata.selectedAddons || [],
        subtotal: metadata.totalPrice || 0, // Using passed total price as subtotal if tax isn't calculated yet
        totalPrice: metadata.totalPrice || 0,
      }));
      // If we pass in package details, skip the first steps and go to Step 3 (Event Details)
      setStep(3);
    }
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
        selectedBenefits: [],
        basePrice: 0,
        selectedAddons: [],
        subtotal: 0,
        tax: 0,
        totalPrice: 0
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
