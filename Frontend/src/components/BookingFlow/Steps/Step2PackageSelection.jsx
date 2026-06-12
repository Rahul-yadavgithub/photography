import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getPackages } from '../../../api/packageService';
import { Loader2 } from 'lucide-react';
import { useBooking } from '../../../context/BookingContext';

const Step2PackageSelection = ({ data, updateData, onNext }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { pauseBookingFlow } = useBooking();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch packages filtered by category
        const responseData = await getPackages(data.enquiryType);
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

  const handleSelectPackage = (pkg) => {
    updateData({ 
      packageId: pkg._id,
      packageName: pkg.name,
      selectedPackageSnapshot: pkg
    });
    // Immediately continue booking
    setTimeout(onNext, 50);
  };

  const handleMoreDetails = (pkg) => {
    pauseBookingFlow();
    navigate(`/packages/${pkg._id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center pt-10">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-4" />
        <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Loading Packages...</p>
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
    <div className="flex flex-col w-full max-w-5xl mx-auto pt-4 pb-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Choose Your Package</h2>
        <p className="text-gray-500 text-sm">Select the perfect package for your {data.enquiryType} Photography.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {packages.map((pkg, idx) => {
          // Format price
          const priceDisplay = pkg.showPricing === false 
            ? 'Custom Quote' 
            : `₹${(pkg.discountPrice || pkg.price || 0).toLocaleString()}`;

          return (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full w-full"
            >
              {/* Section 1: Hero Thumbnail */}
              <div className="w-full aspect-video relative overflow-hidden bg-gray-100 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                <img 
                  src={pkg.media?.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                    {data.enquiryType}
                  </span>
                </div>
              </div>

              {/* Section 2: Package Information */}
              <div className="p-6 pb-8 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <h3 className="text-xl font-serif text-gray-900 leading-tight">
                    {pkg.name}
                  </h3>
                  <span className="text-lg font-bold text-gray-900 shrink-0">
                    {priceDisplay}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm line-clamp-1">
                  {pkg.shortDesc || `Premium ${data.enquiryType} coverage.`}
                </p>
              </div>

              {/* Section 3: Actions */}
              <div className="p-6 pt-0 mt-auto flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full">
                <button
                  onClick={() => handleMoreDetails(pkg)}
                  className="flex-1 py-3 px-3 bg-white border border-gray-300 text-gray-800 font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-gray-50 transition-colors text-center shadow-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className="flex-1 py-3 px-3 bg-[#fb641b] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#f05a16] transition-colors text-center shadow-sm"
                >
                  Select Package
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Step2PackageSelection;
