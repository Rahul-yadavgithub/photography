import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPackages } from '../../../api/packageService';
import { Loader2, Check, Clock, Users, Video } from 'lucide-react';

const Step2PackageSelection = ({ data, updateData, onNext }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch packages filtered by category
        const responseData = await getPackages(data.enquiryType);
        // The API now directly returns the array (or we can adapt based on how getPackages returns it)
        // getPackages returns data.data directly if success, so it's an array.
        if (Array.isArray(responseData)) {
          const filteredPkgs = responseData.filter(
            p => p.category === data.enquiryType && p.status === 'Published'
          );
          setPackages(filteredPkgs);
        } else {
          setError('Failed to load packages for this category.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (data.enquiryType) {
      loadPackages();
    }
  }, [data.enquiryType]);

  const handleSelect = (pkg) => {
    updateData({ 
      packageId: pkg._id,
      packageName: pkg.name,
      selectedPackageSnapshot: pkg
    });
    setTimeout(onNext, 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center pt-10">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-4" />
        <p className="text-gray-500 text-sm">Loading available packages...</p>
      </div>
    );
  }

  if (error || packages.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center pt-10 text-center">
        <p className="text-gray-900 font-medium mb-2">{error || `No packages currently available for ${data.enquiryType}.`}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm text-gray-500 underline hover:text-gray-900"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Choose Your Package</h2>
        <p className="text-gray-500 text-sm">Select the perfect package for your {data.enquiryType}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 px-2">
        {packages.map((pkg, idx) => {
          const isSelected = data.packageId === pkg._id;
          
          return (
            <motion.button
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(pkg)}
              className={`
                relative flex flex-col text-left overflow-hidden rounded-[2rem] border transition-all duration-300
                ${isSelected 
                  ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.02]' 
                  : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 hover:shadow-xl'
                }
              `}
            >
              {pkg.isPopular && (
                <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full z-10 ${isSelected ? 'bg-white text-gray-900' : 'bg-[#D4AF37] text-white'}`}>
                  Popular
                </div>
              )}

              {pkg.media?.thumbnail && (
                <div className="w-full h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 z-0"></div>
                  <img src={pkg.media.thumbnail} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              )}

              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className={`text-xl font-bold font-serif mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  {pkg.showPricing && (
                     <div className="flex items-baseline gap-2">
                       <span className={`text-2xl font-light tracking-tight ${isSelected ? 'text-[#D4AF37]' : 'text-gray-900'}`}>
                         ₹{pkg.discountPrice ? pkg.discountPrice.toLocaleString() : pkg.price?.toLocaleString()}
                       </span>
                       {pkg.discountPrice && pkg.price && (
                         <span className="text-sm line-through text-gray-400">
                           ₹{pkg.price.toLocaleString()}
                         </span>
                       )}
                     </div>
                  )}
                </div>

                <p className={`text-sm leading-relaxed mb-6 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  {pkg.shortDesc || "Premium photography experience tailored for your special day."}
                </p>

                <div className="flex-1 space-y-3 mb-6">
                  {pkg.features?.slice(0, 5).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 ${isSelected ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <Check className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#D4AF37]'}`} />
                      </div>
                      <span className={`text-sm leading-tight ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                        {feature.title}
                      </span>
                    </div>
                  ))}
                  {pkg.features?.length > 5 && (
                     <p className={`text-xs italic ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>+ {pkg.features.length - 5} more features</p>
                  )}
                </div>

              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Step2PackageSelection;
