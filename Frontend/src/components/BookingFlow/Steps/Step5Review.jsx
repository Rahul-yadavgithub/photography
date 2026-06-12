import React, { useState, useEffect } from 'react';
import { Edit2, AlertCircle, X, Check, CreditCard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const Step5Review = ({ data, onNext, onEditStep }) => {
  const pkg = data.selectedPackageSnapshot;
  const totalAmount = pkg?.discountPrice || pkg?.price || 0;

  const handleProceed = () => {
    onNext();
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

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full pt-4 relative">

      <div className="mb-8 text-center mt-2">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Review Booking</h2>
        <p className="text-gray-500 text-sm">Please verify your booking details and select a payment option.</p>
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

          {renderSection('Selected Package & Add-ons', 2, (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">{pkg?.name || data.packageName}</span>
                <span className="text-gray-900 font-medium">₹{(data.basePrice || pkg?.discountPrice || pkg?.price || 0).toLocaleString()}</span>
              </div>
              
              {data.selectedAddons && data.selectedAddons.length > 0 && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-100 py-2 my-2">
                  {data.selectedAddons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">+ {addon.name}</span>
                      <span className="text-gray-600">₹{(addon.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="font-bold text-[#ea580c] text-xl">₹{(data.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      <div className="mt-auto pt-6 pb-4">
        <button
          onClick={handleProceed}
          className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          Proceed to Payment <CreditCard className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step5Review;
