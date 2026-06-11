import React from 'react';
import { Check, Star, Tag } from 'lucide-react';

const PackageLivePreview = ({ formData, features, addOns, media, settings }) => {
  const activeFeatures = features.filter(f => f.status === 'Active');
  const activeAddOns = addOns.filter(a => a.status === 'Active');

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Package Details & Features */}
        <div className="flex-grow flex flex-col border-b md:border-b-0 md:border-r border-zinc-100">
          {/* Media Banner */}
          {(media?.banner || media?.thumbnail) && (
            <div className="w-full h-56 bg-zinc-100 relative">
              <img src={media.banner || media.thumbnail} alt="Package Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-10 flex-grow">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  {formData.category || 'Category'}
                </span>
                {settings?.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    <Star className="w-3 h-3 fill-amber-700" /> Featured
                  </span>
                )}
                {settings?.isPopular && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    <Tag className="w-3 h-3" /> Popular
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">{formData.name || 'Untitled Package'}</h3>
              <p className="text-zinc-600 text-base leading-relaxed">{formData.description || 'No description provided.'}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-5">Included Features</h4>
              {activeFeatures.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">No features added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {activeFeatures.map(feature => (
                    <li key={feature.id} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <span className="block font-bold text-zinc-900 text-base">{feature.title}</span>
                        {feature.description && <span className="block text-sm text-zinc-500 mt-0.5">{feature.description}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Pricing & Add-ons */}
        <div className="w-full md:w-[320px] shrink-0 bg-zinc-50 p-8 md:p-10 flex flex-col">
          <div className="mb-8">
            {settings?.showPricing === false ? (
              <div className="mb-6">
                <span className="text-zinc-500 font-bold block mb-1">Pricing</span>
                <span className="text-3xl font-black text-zinc-900 tracking-tighter block mt-2">
                  Contact Us
                </span>
                <p className="text-sm text-zinc-500 mt-2 font-medium">Custom quote required based on requirements.</p>
              </div>
            ) : (
              <>
                <span className="text-zinc-500 font-bold block mb-1">Starting Price</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                    ${formData.price || '0'}
                  </span>
                  {formData.discountPrice && (
                    <span className="text-lg font-bold text-zinc-400 line-through mb-1">${formData.discountPrice}</span>
                  )}
                </div>
              </>
            )}
            
            <button className="w-full mt-6 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 hover:-translate-y-0.5 transition-all">
              {settings?.showPricing === false ? 'Request Quote' : 'Book This Package'}
            </button>
          </div>

          {settings?.allowAddOns !== false && (
            <div className="flex-grow border-t border-zinc-200/50 pt-8 mt-2">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 pb-4 border-b border-zinc-200">Optional Add-Ons</h4>
              {activeAddOns.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">No add-ons available.</p>
              ) : (
                <ul className="space-y-3">
                  {activeAddOns.map(addon => (
                    <li key={addon.id} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-zinc-700">{addon.name}</span>
                      <span className="font-bold text-zinc-900">
                        {settings?.showPricing === false ? 'On Request' : `+$${addon.price}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PackageLivePreview;
