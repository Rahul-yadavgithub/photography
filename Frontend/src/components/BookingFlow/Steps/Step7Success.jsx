import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Step7Success = ({ data, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      onClose();
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto w-full text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
      >
        <Check className="w-10 h-10 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-4">
          Booking Confirmed
        </h2>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          Thank you, {data.name.split(' ')[0]}! Your booking request has been received. Our team will contact you shortly at {data.mobile}.
        </p>

        {data.bookingReference && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-10 inline-block border border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Booking Reference</p>
            <p className="text-2xl font-mono text-gray-900 tracking-wider">{data.bookingReference}</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-auto pt-8"
      >
        <button
          onClick={() => { onClose(); navigate('/'); }}
          className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
};

export default Step7Success;
