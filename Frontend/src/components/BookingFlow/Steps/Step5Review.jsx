import React, { useState, useEffect } from 'react';
import { Edit2, AlertCircle, X, Check } from 'lucide-react';
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
          packageId: data.packageId,
          packageName: data.packageName,
          selectedPackageSnapshot: data.selectedPackageSnapshot,
          eventDate: data.eventDate,
          eventLocation: data.eventLocation,
          notes: data.notes,
          specialInstructions: data.specialInstructions,
          extraRequirements: data.extraRequirements,
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
    <div className="py-5 border-b border-gray-100 last:border-0 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</h3>
        <button 
          onClick={() => onEditStep(stepIndex)}
          className="text-gray-300 hover:text-gray-900 transition-colors p-1 opacity-0 group-hover:opacity-100"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="text-gray-900">{content}</div>
    </div>
  );

  const pkg = data.selectedPackageSnapshot;

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
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Review Booking</h2>
        <p className="text-gray-500 text-sm">Please verify your booking details before confirming.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-8">
        <div className="bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-gray-100">
          
          {renderSection('Personal Details', 0, (
            <div>
              <p className="font-bold text-lg">{data.name}</p>
              <p className="text-gray-500 text-sm">{data.mobile}</p>
            </div>
          ))}

          {renderSection('Event Information', 3, (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-500 text-xs mb-1">Type</p>
                <p className="font-bold text-sm">{data.enquiryType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="font-bold text-sm">
                  {data.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Location</p>
                <p className="font-bold text-sm">{data.eventLocation || 'Not set'}</p>
              </div>
            </div>
          ))}

          {renderSection('Selected Package', 2, (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{pkg?.name || data.packageName}</h4>
                  <p className="text-gray-500 text-sm mt-0.5">
                    ₹{pkg?.discountPrice ? pkg.discountPrice.toLocaleString() : pkg?.price?.toLocaleString() || 'Custom'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {pkg?.features?.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(data.specialInstructions || data.extraRequirements || data.notes) && renderSection('Customer Notes', 3, (
            <div className="space-y-4">
              {data.specialInstructions && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Special Instructions</p>
                  <p className="text-sm text-gray-800">{data.specialInstructions}</p>
                </div>
              )}
              {data.extraRequirements && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Extra Requirements</p>
                  <p className="text-sm text-gray-800">{data.extraRequirements}</p>
                </div>
              )}
            </div>
          ))}

          {renderSection('Payment Plan', 4, (
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-2">
              <div>
                <p className="font-bold text-gray-900">{data.advancePlan}</p>
                <p className="text-sm text-gray-500 mt-0.5">{data.advancePercentage}% Advance required to secure booking</p>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
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
