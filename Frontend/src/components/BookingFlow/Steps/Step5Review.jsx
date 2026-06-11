import React, { useState, useEffect } from 'react';
import { Edit2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const Step5Review = ({ data, onNext, onEditStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('You must be signed in to submit a booking.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          customerName: data.name,
          mobileNumber: data.mobile,
          enquiryType: data.enquiryType,
          eventDate: data.eventDate,
          requirements: data.requirements,
          advancePlan: data.advancePlan,
          advancePercentage: data.advancePercentage,
          selectedBenefits: data.selectedBenefits,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onNext(result.data.bookingReference);
      } else {
        setError(result.message || 'Failed to submit booking. Please check your details and try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('A network error occurred. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const renderSection = (title, stepIndex, content) => (
    <div className="py-4 border-b border-gray-100 last:border-0 group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h3>
        <button 
          onClick={() => onEditStep(stepIndex)}
          className="text-gray-300 hover:text-gray-900 transition-colors p-1 opacity-0 group-hover:opacity-100"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="text-gray-900 text-sm">{content}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full pt-4 relative">
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start shadow-lg shadow-red-500/10"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-bold text-sm mb-1">Booking Error</h4>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center mt-2">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Review Details</h2>
        <p className="text-gray-500 text-sm">Please verify your booking details before confirming.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-8">
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
          
          {renderSection('Personal Details', 0, (
            <div>
              <p className="font-medium text-lg">{data.name}</p>
              <p className="text-gray-500">{data.mobile}</p>
            </div>
          ))}

          {renderSection('Event Information', 1, (
            <div className="flex gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Type</p>
                <p className="font-medium">{data.enquiryType}</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="font-medium">
                  {new Date(data.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}

          {renderSection('Requirements', 3, (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {Object.entries(data.requirements).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{key}</p>
                  <p className="font-medium capitalize">{value}</p>
                </div>
              ))}
            </div>
          ))}

          {renderSection('Payment Plan', 4, (
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 mt-2">
              <div>
                <p className="font-bold">{data.advancePlan}</p>
                <p className="text-xs text-gray-500">{data.advancePercentage}% Advance required</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-green-500 font-bold">Selected</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 bg-gray-900 text-white rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  );
};

export default Step5Review;
