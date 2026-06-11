import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { X, ChevronLeft } from 'lucide-react';
import Step0Identification from './Steps/Step0Identification';
import Step1EnquiryType from './Steps/Step1EnquiryType';
import Step2EventDate from './Steps/Step2EventDate';
import Step3Requirements from './Steps/Step3Requirements';
import Step4AdvancePlan from './Steps/Step4AdvancePlan';
import Step5Review from './Steps/Step5Review';
import Step6Success from './Steps/Step6Success';

const PremiumBookingFlow = () => {
  const { isBookingOpen, closeBookingFlow } = useBooking();
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    mobile: '',
    enquiryType: '',
    eventDate: null,
    requirements: {},
    advancePlan: null,
  });

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = (extraData) => {
    if (extraData && typeof extraData === 'string') {
      updateBookingData({ bookingReference: extraData });
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < 6) {
      setStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    closeBookingFlow();
    setTimeout(() => {
      setStep(0);
      setBookingData({
        name: '',
        email: '',
        mobile: '',
        enquiryType: '',
        eventDate: null,
        requirements: {},
        advancePlan: null,
      });
    }, 500);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step0Identification data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 1:
        return <Step1EnquiryType data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 2:
        return <Step2EventDate data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 3:
        return <Step3Requirements data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 4:
        return <Step4AdvancePlan data={bookingData} updateData={updateBookingData} onNext={handleNext} />;
      case 5:
        return <Step5Review data={bookingData} onNext={handleNext} onEditStep={setStep} />;
      case 6:
        return <Step6Success data={bookingData} onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
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
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] flex justify-center px-4 sm:px-0 pointer-events-none"
          >
            <div className="w-full sm:max-w-3xl sm:w-[90vw] md:w-[80vw] lg:w-[60vw] bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto h-[90vh] sm:h-[85vh] flex flex-col relative">
              
              {/* Header / Draggable Area */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                  {step > 0 && step < 6 && (
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

              {/* Progress Indicator (Steps 0-5) */}
              {step < 6 && (
                <div className="h-1 bg-gray-50 w-full relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gray-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 6) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumBookingFlow;
