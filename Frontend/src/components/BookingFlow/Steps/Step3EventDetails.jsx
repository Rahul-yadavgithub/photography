import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, AlignLeft, Check, Package as PackageIcon } from 'lucide-react';

const Step3EventDetails = ({ data, updateData, onNext }) => {
  const [date, setDate] = useState(data.eventDate || null);
  const [location, setLocation] = useState(data.eventLocation || '');
  const [notes, setNotes] = useState(data.notes || '');
  const [specialInstructions, setSpecialInstructions] = useState(data.specialInstructions || '');
  const [extraRequirements, setExtraRequirements] = useState(data.extraRequirements || '');

  const pkg = data.selectedPackageSnapshot;

  const handleContinue = () => {
    updateData({ 
      eventDate: date,
      eventLocation: location,
      notes,
      specialInstructions,
      extraRequirements
    });
    onNext();
  };

  const isFormValid = date !== null && location.trim() !== '';

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Event Details</h2>
        <p className="text-gray-500 text-sm">Review your selected package and tell us when and where.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Read Only Package Details */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 sticky top-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
                <PackageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Selected Package</h3>
                <p className="text-lg font-serif font-bold text-gray-900">{pkg?.name || 'Not Selected'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               {pkg?.features?.map((feature, i) => (
                 <div key={i} className="flex items-start gap-3">
                   <div className="mt-0.5 rounded-full p-0.5 bg-[#D4AF37]/20">
                     <Check className="w-3 h-3 text-[#D4AF37]" />
                   </div>
                   <div>
                     <span className="text-sm font-medium text-gray-800 block">{feature.title || feature}</span>
                     {feature.description && <span className="text-xs text-gray-500 block mt-0.5">{feature.description}</span>}
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Package Price</span>
                <span className="text-sm font-bold text-gray-900">₹{data.basePrice ? data.basePrice.toLocaleString() : 'Custom'}</span>
              </div>
              
              {data.selectedAddons && data.selectedAddons.length > 0 && (
                <div className="mb-3 space-y-2">
                  {data.selectedAddons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center gap-1.5">
                         <span className="text-[#ea580c]">+</span> <span className="line-clamp-1">{addon.name}</span>
                      </span>
                      <span className="text-gray-600 font-medium whitespace-nowrap">₹{(addon.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100 flex justify-between items-end mt-2">
                 <div>
                   <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Total Amount</p>
                 </div>
                 <p className="text-2xl font-black text-[#ea580c] tracking-tight">
                   ₹{data.totalPrice ? data.totalPrice.toLocaleString() : 'Custom'}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Input Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Event Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Event Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="date"
                value={date ? date.toISOString().split('T')[0] : ''}
                onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              />
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Event Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Event Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Venue, or Full Address"
                className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400"
              />
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Special Instructions (Optional)</label>
            <div className="relative">
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any specific moments to capture, surprise plans, etc."
                rows={2}
                className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
              />
              <AlignLeft className="absolute left-5 top-5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Extra Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Extra Requirements (Optional)</label>
            <div className="relative">
              <textarea
                value={extraRequirements}
                onChange={(e) => setExtraRequirements(e.target.value)}
                placeholder="Need extra drone, additional photographer, etc.?"
                rows={2}
                className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
              />
              <AlignLeft className="absolute left-5 top-5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      <div className="mt-auto pt-6 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full md:w-auto px-10 py-4 rounded-xl text-sm font-semibold tracking-wide transition-colors ${
            isFormValid 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step3EventDetails;
