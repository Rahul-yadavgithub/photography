import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ height = "h-[400px]", className = "" }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-zinc-100 rounded-lg ${height} ${className}`}>
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
        }}
      />
      
      {/* Optional Skeleton Content Layout (can be overlaid or customized) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-40">
        <div className="h-4 w-1/3 bg-zinc-300 rounded mb-3"></div>
        <div className="h-6 w-2/3 bg-zinc-300 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-3 w-16 bg-zinc-300 rounded"></div>
          <div className="h-3 w-16 bg-zinc-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
