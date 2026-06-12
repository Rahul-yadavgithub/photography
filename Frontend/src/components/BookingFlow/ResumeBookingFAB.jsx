import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBookingFAB = () => {
  const { isBookingPaused, openBookingFlow } = useBooking();

  return (
    <AnimatePresence>
      {isBookingPaused && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90]"
        >
          <button
            onClick={() => openBookingFlow()}
            className="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-gray-800 transition-colors border border-gray-700/50 group"
          >
            <PlayCircle className="w-6 h-6 text-[#ea580c] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Booking Paused</span>
              <span className="text-sm font-bold tracking-wide">Resume Booking</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeBookingFAB;
