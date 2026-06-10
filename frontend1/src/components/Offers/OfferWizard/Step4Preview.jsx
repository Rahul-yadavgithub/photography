import React from 'react';
import SmartBadge from '../SmartBadge';

const Step4Preview = ({ formData }) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Preview Offer</h2>
        <p className="text-zinc-500 mt-1">Here is how your offer will appear to customers.</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Preview: Package Card Style */}
        <div>
          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 text-center">On Package Card</h4>
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
            {/* Mock Image Area */}
            <div className="absolute top-4 right-4 z-10">
              <SmartBadge type={formData.type} text={formData.badgeText || 'NEW OFFER'} className="shadow-lg backdrop-blur-md bg-white/90" />
            </div>
            <div className="w-full h-40 bg-zinc-100 rounded-2xl mb-5 flex items-center justify-center">
              <span className="text-zinc-400 text-sm font-medium">Package Image</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Luxury Wedding Package</h3>
            <p className="text-sm text-zinc-500 mb-4 line-clamp-2">Comprehensive luxury wedding coverage including drone, 2 cinematographers, and premium albums.</p>
            <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-zinc-400 block">Starting at</span>
                <span className="text-lg font-bold text-zinc-900">$5,000</span>
              </div>
              <button className="px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-xl">Book Now</button>
            </div>
          </div>
        </div>

        {/* Preview: Banner Style */}
        <div>
          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 text-center">Details Banner</h4>
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-3">
              <div>
                <SmartBadge type={formData.type} text={formData.badgeText || 'NEW OFFER'} className="bg-white/10 border-white/20 text-white backdrop-blur-md" />
              </div>
              <h3 className="text-xl font-bold">{formData.title || 'Special Promotion'}</h3>
              <p className="text-sm text-zinc-300">{formData.description || 'Valid for a limited time only.'}</p>
              {formData.endDate && (
                <div className="text-xs font-bold text-emerald-400 mt-2">
                  Valid Until {formData.endDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Preview;
