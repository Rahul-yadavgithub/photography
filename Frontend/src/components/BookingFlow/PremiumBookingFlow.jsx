import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { X, ChevronLeft } from 'lucide-react';
import Step0Identification from './Steps/Step0Identification';
import Step1EnquiryType from './Steps/Step1EnquiryType';
import Step2PackageSelection from './Steps/Step2PackageSelection';
import Step3EventDetails from './Steps/Step3EventDetails';
import Step4AdvancePlan from './Steps/Step4AdvancePlan';
import Step5Review from './Steps/Step5Review';
import Step6Payment from './Steps/Step6Payment';
import Step7Success from './Steps/Step7Success';
import { Check, ChevronUp, ChevronDown } from 'lucide-react';

const BookingSidebar = ({ data }) => {
  if (!data.packageId) return null;
  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 hidden lg:flex flex-col h-full sticky top-0 shrink-0">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your Selection</h3>
        <p className="text-lg font-serif text-gray-900">{data.packageName}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">₹{data.basePrice?.toLocaleString()}</p>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {data.selectedAddons && data.selectedAddons.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Add-ons</h4>
            <ul className="space-y-3">
              {data.selectedAddons.map((addon, idx) => (
                <li key={idx} className="flex items-start justify-between text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-[#ea580c] mt-1 shrink-0" />
                    <span className="text-gray-700">{addon.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium shrink-0 ml-4">+₹{addon.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal</span>
          <span>₹{data.subtotal?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Taxes (Estimated)</span>
          <span>₹{data.tax?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-serif text-2xl text-[#ea580c]">₹{data.totalPrice?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const PremiumBookingFlow = () => {
  const { 
    isBookingOpen, 
    isBookingPaused,
    closeBookingFlow,
    step,
    setStep,
    bookingData,
    updateBookingData 
  } = useBooking();

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isBookingOpen && !isBookingPaused) {
      document.body.style.overflow = 'hidden';
      // For iOS Safari
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isBookingOpen, isBookingPaused]);

  const handleNext = (extraData) => {
    if (extraData && typeof extraData === 'string') {
      updateBookingData({ bookingReference: extraData });
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < 7) {
      setStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    closeBookingFlow();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step0Identification data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 1:
        return <Step1EnquiryType data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 2:
        return <Step2PackageSelection data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 3:
        return <Step3EventDetails data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 4:
        return <Step4AdvancePlan data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 5:
        return <Step5Review data={bookingData} onNext={handleNext} onEditStep={setStep} />;
      case 6:
        return <Step6Payment data={bookingData} onNext={handleNext} onEditStep={setStep} />;
      case 7:
        return <Step7Success data={bookingData} onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {(isBookingOpen && !isBookingPaused) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md"
          />

          {/* Modal Drawer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-[5vh] sm:p-[10vh] pointer-events-none"
          >
            <div className={`w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto h-full flex flex-col relative transition-all duration-500`}
            >
              
              {/* Header / Draggable Area */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-10 shrink-0">
                <div className="flex items-center space-x-4">
                  {step > 0 && step < 7 && (
                    <button 
                      onClick={handleBack}
                      className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-bold tracking-wide uppercase"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </button>
                  )}
                  {step === 0 && <div className="w-10"></div>}
                </div>

                <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                   <div className="w-12 h-1.5 bg-gray-200 rounded-full sm:hidden"></div>
                   <span className="hidden sm:block text-sm font-black tracking-[0.2em] uppercase text-black">
                     Booking
                   </span>
                </div>

                <button 
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Indicator (Steps 0-6) */}
              {step < 7 && (
                <div className="h-1 bg-gray-50 w-full relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gray-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 7) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}

              {/* Body Content with optional Sidebar */}
              <div className="flex-1 overflow-hidden flex relative">
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 sm:px-10 py-8 min-h-full flex flex-col"
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Desktop Sidebar removed as requested */}
              </div>

              {/* Mobile Bottom Sticky Summary */}
              {step > 0 && step < 7 && bookingData.packageId && (
                <div className="lg:hidden shrink-0 border-t border-gray-200 bg-white z-20">
                  {/* Collapsible content */}
                  <AnimatePresence>
                    {isMobileSummaryOpen && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-gray-50 border-b border-gray-200"
                      >
                        <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-900">{bookingData.packageName}</span>
                            <span>₹{bookingData.basePrice?.toLocaleString()}</span>
                          </div>
                          {bookingData.selectedAddons?.map((addon, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-600 pl-4">
                              <span>+ {addon.name}</span>
                              <span>₹{addon.price}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-2 flex justify-between text-xs text-gray-500">
                            <span>Subtotal + Tax</span>
                            <span>₹{bookingData.subtotal?.toLocaleString()} + ₹{bookingData.tax?.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Sticky bar */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Estimate</p>
                      <p className="text-xl font-serif text-[#ea580c] leading-none mt-1">₹{bookingData.totalPrice?.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                    >
                      {isMobileSummaryOpen ? 'Hide Details' : 'View Summary'}
                      {isMobileSummaryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumBookingFlow;
