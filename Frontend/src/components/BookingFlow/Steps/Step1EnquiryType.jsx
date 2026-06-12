import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Heart, Cake, Briefcase, Baby, User, Image, Music, Loader2 } from 'lucide-react';
import { getPackages } from '../../../api/packageService';

const ICON_MAP = {
  'Wedding': <Heart className="w-6 h-6" />,
  'Pre Wedding': <Image className="w-6 h-6" />,
  'Couple Shoot': <User className="w-6 h-6" />,
  'Corporate Event': <Briefcase className="w-6 h-6" />,
  'Birthday': <Cake className="w-6 h-6" />,
  'Maternity Shoot': <Baby className="w-6 h-6" />,
  'Fashion Shoot': <Camera className="w-6 h-6" />,
  'Product Shoot': <Camera className="w-6 h-6" />,
  'Cinematic Reel': <Video className="w-6 h-6" />,
  'Other': <Music className="w-6 h-6" />,
};

const getDefaultIcon = () => <Camera className="w-6 h-6" />;

const Step1EnquiryType = ({ data, updateData, onNext }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        // Fetch all packages to see which categories actually have packages
        const responseData = await getPackages();
        if (Array.isArray(responseData)) {
          const pkgs = responseData;
          // Extract unique categories
          const uniqueCategories = [...new Set(pkgs.map(p => p.category))].filter(Boolean);
          
          const formattedCategories = uniqueCategories.map(cat => ({
            id: cat,
            label: cat,
            icon: ICON_MAP[cat] || getDefaultIcon()
          }));
          
          setCategories(formattedCategories);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const handleSelect = (id) => {
    updateData({ enquiryType: id, packageId: null, packageName: '', selectedPackageSnapshot: null }); // Reset package when category changes
    setTimeout(onNext, 300); // Auto-advance with slight delay for visual feedback
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full items-center justify-center pt-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-4" />
        <p className="text-gray-500 text-sm">Loading available services...</p>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full items-center justify-center pt-4">
        <p className="text-gray-900 font-medium mb-2">{error || "No services currently available."}</p>
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
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">What are you looking for?</h2>
        <p className="text-gray-500 text-sm">Select the type of service you need.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pb-8 px-1">
        <AnimatePresence>
          {categories.map((type, idx) => {
            const isSelected = data.enquiryType === type.id;
            return (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSelect(type.id)}
                className={`
                  flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300
                  ${isSelected 
                    ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                  }
                `}
              >
                <div className={`mb-3 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {type.icon}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {type.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Step1EnquiryType;
