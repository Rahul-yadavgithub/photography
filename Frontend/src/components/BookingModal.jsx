import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronDown, Check } from 'lucide-react';

const ADD_ONS = [
  "Drone Coverage", "Extra Photographer", "Extra Videographer",
  "Same Day Edit", "Premium Album", "Express Delivery",
  "Instagram Reels", "LED Screen Coverage", "Live Streaming",
  "Destination Travel Coverage"
];

function BookingModal({ isOpen, onClose, packageData }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '' });
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset state when newly opened
      setFormData({ name: '', phone: '', email: '', date: '' });
      setSelectedAddons([]);
      setIsSubmitting(false);
      setIsSuccess(false);
      setIsDropdownOpen(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [isOpen, packageData]);

  if (!isOpen || !packageData) return null;

  const handleAddonToggle = (addon) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const removeAddon = (addon) => {
    setSelectedAddons(selectedAddons.filter(a => a !== addon));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call and Data storage
    console.log("Submitting Booking:", {
      Category: packageData.category,
      PackageName: packageData.name,
      IncludedServices: packageData.features,
      CustomerInfo: formData,
      SelectedAddOns: selectedAddons,
      Timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Prevent past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Blurred Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-modal border border-white/20 flex flex-col max-h-[90vh]">
        
        {/* Success State */}
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif text-gray-900 mb-4 tracking-tight">Thank You!</h2>
            <p className="text-gray-600 text-lg mb-10 max-w-sm leading-relaxed">
              Your inquiry has been received successfully. Our team will contact you shortly to discuss your shoot requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium tracking-wide uppercase text-xs"
              >
                Back to Website
              </button>
              <button 
                onClick={() => setIsSuccess(false)}
                className="px-8 py-3 bg-[#ea580c] text-white rounded-md hover:bg-[#c2410c] transition-colors font-medium tracking-wide uppercase text-xs shadow-lg shadow-[#ea580c]/20"
              >
                Book Another Package
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start shrink-0 bg-white/50">
              <div>
                <h2 className="text-3xl font-serif text-gray-900 tracking-tight">Book Your Shoot</h2>
                <p className="text-sm text-gray-500 mt-2">Complete your details and we'll contact you shortly.</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-8 overflow-y-auto">
              
              {/* Selected Package Summary (Read-Only) */}
              <div className="bg-[#f8fafc] rounded-xl p-6 mb-8 border border-gray-100 shadow-sm">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#ea580c] mb-1.5 block">
                  {packageData.category}
                </span>
                <h3 className="text-2xl font-serif text-gray-900 mb-5">{packageData.name}</h3>
                
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Included Services:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {packageData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none transition-all placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none transition-all placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none transition-all placeholder-gray-400"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Preferred Shoot Date *</label>
                    <input 
                      type="date" required min={today}
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] outline-none transition-all text-gray-700"
                    />
                  </div>
                </div>

                {/* Add-ons Multi-Select */}
                <div className="space-y-2 relative pt-2">
                  <label className="text-sm font-semibold text-gray-700">Additional Services (Optional)</label>
                  
                  {/* Selected Chips */}
                  {selectedAddons.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mb-3">
                      {selectedAddons.map(addon => (
                        <span key={addon} className="inline-flex items-center space-x-1.5 pl-3 pr-1.5 py-1.5 bg-[#ea580c]/5 text-[#ea580c] text-xs font-semibold tracking-wide rounded-full border border-[#ea580c]/20 shadow-sm">
                          <span>{addon}</span>
                          <button 
                            type="button" 
                            onClick={() => removeAddon(addon)}
                            className="p-0.5 hover:bg-[#ea580c]/10 rounded-full transition-colors text-[#ea580c]/70 hover:text-[#ea580c]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dropdown Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-md flex items-center justify-between hover:border-gray-300 transition-colors text-left"
                  >
                    <span className="text-gray-400">Select add-ons...</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                      {ADD_ONS.map((addon) => {
                        const isSelected = selectedAddons.includes(addon);
                        return (
                          <div 
                            key={addon}
                            onClick={() => handleAddonToggle(addon)}
                            className={`flex items-center space-x-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${isSelected ? 'bg-orange-50/30' : ''}`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-[#ea580c]' : 'bg-gray-100 border border-gray-200'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{addon}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Final Booking Summary */}
                {(formData.name || formData.date || selectedAddons.length > 0) && (
                  <div className="pt-8 mt-8 border-t border-gray-100">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Booking Summary</h4>
                    <div className="bg-[#f8fafc] rounded-xl p-6 space-y-4 text-sm border border-gray-100">
                      
                      <div>
                        <p className="text-gray-500 mb-1">Selected Package:</p>
                        <p className="font-semibold text-gray-900">{packageData.name}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 mb-2">Included Services:</p>
                        <ul className="space-y-1">
                          {packageData.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-gray-900">
                              <span className="text-gray-400">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedAddons.length > 0 && (
                        <div>
                          <p className="text-gray-500 mb-2">Selected Add-Ons:</p>
                          <ul className="space-y-1">
                            {selectedAddons.map((addon, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-gray-900">
                                <span className="text-gray-400">•</span>
                                <span>{addon}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-500 mb-1">Preferred Date:</p>
                        <p className="font-semibold text-gray-900">{formData.date || 'Selected by user'}</p>
                      </div>

                    </div>
                  </div>
                )}
              </form>
            </div>
            
            {/* Submit */}
            <div className="p-8 pt-4 border-t border-gray-100 shrink-0 bg-white">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#ea580c] text-white rounded-md font-bold tracking-widest uppercase text-xs hover:bg-[#c2410c] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#ea580c]/20 flex justify-center items-center h-[56px]"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
