import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

// Function to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Step6Payment = ({ data, onNext, onEditStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const pkg = data.selectedPackageSnapshot;
  const totalAmount = pkg?.discountPrice || pkg?.price || 0;
  const advanceAmount = Math.round((totalAmount * (data.advancePercentage || 0)) / 100);
  const remainingAmount = totalAmount - advanceAmount;

  const handleSubmit = async (isAdvancePayment) => {
    if (!user?.id) {
      setError('You must be signed in to submit a booking.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create Booking (and Razorpay Order if advance payment)
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerName: data.name,
          mobileNumber: data.mobile,
          enquiryType: data.enquiryType,
          packageId: data.packageId,
          packageName: data.packageName,
          selectedPackageSnapshot: pkg,
          eventDate: data.eventDate,
          eventLocation: data.eventLocation,
          notes: data.notes,
          specialInstructions: data.specialInstructions,
          extraRequirements: data.extraRequirements,
          advancePlan: data.advancePlan,
          advancePercentage: data.advancePercentage,
          selectedBenefits: data.selectedBenefits,
          isAdvancePayment,
          totalAmount,
          advanceAmount
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit booking.');
      }

      // If Option B (No Advance), we're done!
      if (!isAdvancePayment || advanceAmount === 0) {
        onNext(result.data.bookingReference);
        return;
      }

      // If Option A, open Razorpay Checkout
      const order = result.order;
      if (!order) throw new Error('Order creation failed.');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'Guide Studio',
        description: `Advance Payment for ${data.packageName}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify Payment
          try {
            const verifyRes = await fetch(`${backendUrl}/api/bookings/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: result.data._id
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onNext(result.data.bookingReference);
            } else {
              setError('Payment verification failed.');
              setIsSubmitting(false);
            }
          } catch (err) {
            setError('Payment verification failed.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: data.name,
          email: user?.primaryEmailAddress?.emailAddress || '',
          contact: data.mobile,
        },
        theme: {
          color: '#111827', // Gray-900
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setError('Payment cancelled. Your booking is currently saved as a draft.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setIsSubmitting(false);
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

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
              <h4 className="text-red-800 font-bold text-sm mb-1">Payment Error</h4>
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
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Payment Selection</h2>
        <p className="text-gray-500 text-sm">Choose how you would like to proceed with your booking.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-8">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
          
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Booking Amount</span>
                <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
                <span className="text-gray-600">Required Advance ({data.advancePercentage}%)</span>
                <span className="font-bold text-gray-900">₹{advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-bold text-gray-900">₹{remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Option A: Pay Advance */}
            {advanceAmount > 0 && (
              <div className="p-5 rounded-2xl border-2 border-gray-900 bg-white shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 opacity-80" />
                </div>
                <div className="flex justify-between items-start mb-5">
                  <div className="pr-8">
                    <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> 
                      Pay Advance Now
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Instantly confirm and secure your booking by paying the advance amount.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : `Pay ₹${advanceAmount.toLocaleString()} & Book`}
                </button>
              </div>
            )}

            {/* Option B: No Advance */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 transition-all hover:shadow-sm">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" /> 
                    Book Without Advance
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Submit your request for studio approval. Your booking will remain unconfirmed until payment is sorted.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : 'Submit Request Only'}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Step6Payment;
