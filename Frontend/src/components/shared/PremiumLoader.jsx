import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = ({ text = "CURATING EXPERIENCE..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[30vw] h-[30vw] bg-black opacity-[0.02] rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-8">
          <motion.div
            className="absolute inset-0 border-[1px] border-black/10 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-2 border-[1px] border-black/20 rounded-full"
            animate={{ scale: [1, 0.8, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Inner Shutter/Aperture Core */}
          <motion.div 
            className="w-4 h-4 bg-black rounded-sm"
            animate={{ rotate: 180 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="text-xs font-bold text-black uppercase tracking-[0.3em]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
};

export default PremiumLoader;
