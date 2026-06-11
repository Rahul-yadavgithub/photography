import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Heart, Cake, Briefcase, Baby, User, Image, Music } from 'lucide-react';

const ENQUIRY_TYPES = [
  { id: 'Wedding', label: 'Wedding', icon: <Heart className="w-6 h-6" /> },
  { id: 'Pre Wedding', label: 'Pre Wedding', icon: <Image className="w-6 h-6" /> },
  { id: 'Couple Shoot', label: 'Couple Shoot', icon: <User className="w-6 h-6" /> },
  { id: 'Corporate Event', label: 'Corporate Event', icon: <Briefcase className="w-6 h-6" /> },
  { id: 'Birthday', label: 'Birthday', icon: <Cake className="w-6 h-6" /> },
  { id: 'Maternity Shoot', label: 'Maternity', icon: <Baby className="w-6 h-6" /> },
  { id: 'Fashion Shoot', label: 'Fashion', icon: <Camera className="w-6 h-6" /> },
  { id: 'Product Shoot', label: 'Product', icon: <Camera className="w-6 h-6" /> },
  { id: 'Cinematic Reel', label: 'Cinematic', icon: <Video className="w-6 h-6" /> },
  { id: 'Other', label: 'Other', icon: <Music className="w-6 h-6" /> },
];

const Step1EnquiryType = ({ data, updateData, onNext }) => {
  const handleSelect = (id) => {
    updateData({ enquiryType: id });
    setTimeout(onNext, 300); // Auto-advance with slight delay for visual feedback
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">What are you looking for?</h2>
        <p className="text-gray-500 text-sm">Select the type of service you need.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pb-8 px-1">
        {ENQUIRY_TYPES.map((type, idx) => {
          const isSelected = data.enquiryType === type.id;
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
      </div>
    </div>
  );
};

export default Step1EnquiryType;
