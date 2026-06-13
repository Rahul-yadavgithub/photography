import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageById } from '../api/packageService';
import { getActiveOffers } from '../api/offerService';
import { Camera, Video, Image as ImageIcon, Film, BookOpen, Navigation, Play, Plus, Check, Tag, ChevronDown, ChevronUp, Square, CheckSquare } from 'lucide-react';
import { useIntent } from '../context/IntentContext';
import EditorialHero from '../components/common/EditorialHero';
import useSEO from '../hooks/useSEO';
import PremiumLoader from '../components/shared/PremiumLoader';

const ICON_MAP = {
  camera: Camera,
  video: Video,
  gallery: ImageIcon,
  film: Film,
  album: BookOpen,
  drone: Navigation,
  live: Play
};

function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);
  const [isAddonsOpen, setIsAddonsOpen] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const { executeProtectedAction } = useIntent();

  const totalPrice = pkg ? (pkg.price + selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0)) : 0;

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const currentId = addon.id || addon._id;
      const isSelected = prev.some(a => (a.id || a._id) === currentId);
      if (isSelected) {
        return prev.filter(a => (a.id || a._id) !== currentId);
      } else {
        return [...prev, addon];
      }
    });
  };

  useSEO({ title: pkg ? pkg.name : null, customSeoTitle: pkg?.seoTitle, customSeoDescription: pkg?.seoDescription });

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const [data, offersData] = await Promise.all([
          getPackageById(id),
          getActiveOffers()
        ]);
        setPkg(data);
        
        // Find applicable offers for this package
        const applicableOffers = offersData.filter(o => 
          o.applicablePackages.some(ap => ap._id === data._id || ap.id === data._id || ap === data._id || ap.slug === data.slug || ap._id === data.slug)
        );
        setOffers(applicableOffers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPkg();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-20 flex items-center justify-center bg-[#f8fafc]">
        <PremiumLoader text="CURATING PACKAGE..." />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="w-full min-h-screen pt-32 flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Package Not Found</h2>
          <Link to="/packages" className="text-[#ea580c] underline">Return to Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-32">

      <EditorialHero
        breadcrumbs={[
          { label: 'Packages', path: '/packages' },
          { label: pkg.category, path: `/category/${pkg.category.toLowerCase().replace(/\s+/g, '-')}` },
          { label: pkg.name }
        ]}
        label={pkg.category}
        title={pkg.name}
        description={pkg.shortDesc || pkg.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Dynamic Pricing / Savings Hierarchy */}
        {pkg.showPricing !== false && offers.length > 0 && offers.some(o => o.type === 'Percentage Discount' || o.type === 'Flat Discount') && (
          <div className="bg-white rounded-3xl p-8 border border-[#ea580c]/20 shadow-[0_8px_30px_rgb(234,88,12,0.1)] mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider rounded-full">Limited Offer</span>
                <span className="text-gray-600 font-bold line-through text-lg">₹{pkg.price}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  ₹{
                    offers.reduce((lowest, o) => {
                      if (o.type === 'Percentage Discount') {
                        const price = pkg.price - (pkg.price * (o.discountPercentage / 100));
                        return price < lowest ? price : lowest;
                      }
                      if (o.type === 'Flat Discount') {
                        const price = pkg.price - o.flatDiscountAmount;
                        return price < lowest ? price : lowest;
                      }
                      return lowest;
                    }, pkg.price)
                  }
                </span>
                <span className="text-gray-600 font-medium mb-1">/ package</span>
              </div>
            </div>
            
            <div className="bg-[#ea580c] text-white px-6 py-4 rounded-2xl shrink-0 flex items-center gap-4 w-full md:w-auto justify-center">
              <div className="text-right">
                <div className="text-xs font-bold text-orange-200 uppercase tracking-widest mb-1">You Save</div>
                <div className="text-2xl font-black tracking-tight">
                  ₹{
                    pkg.price - offers.reduce((lowest, o) => {
                      if (o.type === 'Percentage Discount') {
                        const price = pkg.price - (pkg.price * (o.discountPercentage / 100));
                        return price < lowest ? price : lowest;
                      }
                      if (o.type === 'Flat Discount') {
                        const price = pkg.price - o.flatDiscountAmount;
                        return price < lowest ? price : lowest;
                      }
                      return lowest;
                    }, pkg.price)
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Offers & Benefits Section */}
        {offers.length > 0 && (
          <section className="mb-20">
            <h3 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3">
              <Tag className="w-6 h-6 text-[#ea580c]" /> Special Offers & Benefits
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offers.map(offer => (
                <div key={offer._id} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Tag className="w-5 h-5 text-[#ea580c]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-1 bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        {offer.badgeText}
                      </span>
                      {offer.validUntil && (
                         <span className="text-xs font-medium text-orange-800">
                           Valid till {new Date(offer.validUntil).toLocaleDateString()}
                         </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{offer.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{offer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 2. Included Experiences Section (Dense Layout) */}
      <section id="experiences" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
            className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-serif text-gray-900 flex items-center gap-3">
              Included Services
              <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-sans font-bold">{pkg.features?.length || 0}</span>
            </h2>
            {isFeaturesOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          
          {isFeaturesOpen && (
            <div className="p-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {pkg.features.map(feature => {
                  const Icon = ICON_MAP[feature.iconKey] || Check;
                  return (
                    <div key={feature.id} className="flex items-start gap-3 group">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ea580c] transition-colors" />
                          <h3 className="text-[15px] font-semibold text-gray-900">{feature.title}</h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Add-On Experience (Dense Layout) */}
      {pkg.allowAddOns && pkg.addOns && pkg.addOns.length > 0 && (
        <section id="addons" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setIsAddonsOpen(!isAddonsOpen)}
              className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-serif text-gray-900 flex items-center gap-3">
                Optional Upgrades
                <span className="text-xs bg-orange-100 text-[#ea580c] px-2.5 py-1 rounded-full font-sans font-bold">{pkg.addOns?.length || 0}</span>
              </h2>
              {isAddonsOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            
            {isAddonsOpen && (
              <div className="p-0 border-t border-gray-100">
                <div className="flex flex-col">
                  {pkg.addOns.map((addon, index) => {
                    const currentId = addon.id || addon._id;
                    const isSelected = selectedAddons.some(a => (a.id || a._id) === currentId);
                    return (
                      <div 
                        key={currentId} 
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${index !== pkg.addOns.length - 1 ? 'border-b border-gray-50' : ''} ${isSelected ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <button className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#ea580c] border-[#ea580c]' : 'bg-white border-gray-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                          <div>
                            <h3 className="text-[15px] font-semibold text-gray-900">{addon.name}</h3>
                            {addon.description && <p className="text-xs text-gray-500 hidden sm:block mt-0.5">{addon.description}</p>}
                          </div>
                        </div>
                        {pkg.showPricing !== false && addon.price && (
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#ea580c]' : 'text-gray-900'}`}>+₹{addon.price}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Package Summary */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Package Summary</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-[#ea580c]" />
                <span>{pkg.features?.length || 0} Included Services</span>
              </li>
              {pkg.allowAddOns && (
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#ea580c]" />
                  <span>{selectedAddons.length} Optional Upgrades Selected</span>
                </li>
              )}
            </ul>
          </div>
          {pkg.showPricing !== false && (
            <div className="w-full md:w-auto flex flex-col items-start md:items-end p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Estimated Investment</span>
              <div className="text-3xl font-serif text-white">
                ₹{totalPrice}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Media Showcase (Gallery) */}
      {pkg.media.gallery && pkg.media.gallery.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-900 mb-4">The Portfolio</h2>
              <div className="w-16 h-0.5 bg-[#ea580c] mx-auto"></div>
              <p className="mt-6 text-gray-700 max-w-2xl mx-auto">A glimpse into the cinematic quality and timeless memories you can expect from this collection.</p>
            </div>

            {/* Masonry Layout via CSS Columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {pkg.media.gallery.map((img, idx) => (
                <div key={idx} className="break-inside-avoid overflow-hidden rounded-2xl relative group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Bottom Inquiry Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 sm:p-6 z-50 transform translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-serif text-gray-900">{pkg.name}</h4>
            {pkg.showPricing !== false ? (
              <p className="text-gray-700 font-medium">
                {selectedAddons.length > 0 ? 'Total Estimate' : 'Starting at'} <span className="font-bold text-gray-900">₹{totalPrice}</span>
              </p>
            ) : (
              <p className="text-gray-700 font-medium">Contact for Custom Quote</p>
            )}
          </div>
          <button
            onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW', { 
              packageId: pkg._id,
              category: pkg.category, 
              name: pkg.name, 
              basePrice: pkg.price,
              features: pkg.features.map(f => f.title),
              selectedAddons: selectedAddons,
              totalPrice: totalPrice
            })}
            className="w-full sm:w-auto px-8 py-4 bg-[#ea580c] text-white font-bold rounded-full hover:bg-[#c2410c] hover:-translate-y-1 transition-all shadow-lg"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetailPage;
