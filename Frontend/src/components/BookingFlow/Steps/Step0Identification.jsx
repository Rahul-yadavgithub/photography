import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const Step0Identification = ({ data, updateData, onNext }) => {
  const [error, setError] = useState('');
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user && isLoaded) {
      const updates = {};
      if (!data.name && user.fullName) updates.name = user.fullName;
      if (!data.email && user.primaryEmailAddress?.emailAddress) updates.email = user.primaryEmailAddress.emailAddress;
      if (Object.keys(updates).length > 0) {
        updateData(updates);
      }
    }
  }, [user, isLoaded, data.name, data.email, updateData]);

  const handleNext = () => {
    if (!data.name || data.name.length < 3) {
      setError('Please enter a valid name (min 3 characters).');
      return;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!data.mobile || !/^\+?[0-9]{10,15}$/.test(data.mobile)) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full max-w-md mx-auto w-full pt-4"
    >
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-sans font-medium tracking-tight text-black mb-2">Let's get started.</h2>
        <p className="text-gray-900 font-medium text-base">Please provide your details to begin the booking process.</p>
      </div>

      <div className="space-y-4 flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-1"
        >
          <label className="text-xs font-black uppercase tracking-widest text-gray-900 ml-1">Full Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly={!!user?.fullName}
            onChange={(e) => {
              if (!user?.fullName) {
                setError('');
                updateData({ name: e.target.value });
              }
            }}
            placeholder="John Doe"
            className={`w-full px-5 py-3 border border-gray-400 shadow-sm rounded-xl text-gray-900 font-bold text-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all placeholder:text-gray-500 placeholder:font-medium ${user?.fullName ? 'bg-gray-100 cursor-not-allowed opacity-80 text-gray-600' : 'bg-white'}`}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-1"
        >
          <label className="text-xs font-black uppercase tracking-widest text-gray-900 ml-1">Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            readOnly={!!user?.primaryEmailAddress?.emailAddress}
            onChange={(e) => {
              if (!user?.primaryEmailAddress?.emailAddress) {
                setError('');
                updateData({ email: e.target.value });
              }
            }}
            placeholder="john@example.com"
            className={`w-full px-5 py-3 border border-gray-400 shadow-sm rounded-xl text-gray-900 font-bold text-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all placeholder:text-gray-500 placeholder:font-medium ${user?.primaryEmailAddress?.emailAddress ? 'bg-gray-100 cursor-not-allowed opacity-80 text-gray-600' : 'bg-white'}`}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-1"
        >
          <label className="text-xs font-black uppercase tracking-widest text-gray-900 ml-1">Mobile Number</label>
          <input
            type="tel"
            value={data.mobile || ''}
            onChange={(e) => {
              setError('');
              updateData({ mobile: e.target.value });
            }}
            placeholder="+91 98765 43210"
            className="w-full px-5 py-3 bg-white border border-gray-400 shadow-sm rounded-xl text-gray-900 font-bold text-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all placeholder:text-gray-500 placeholder:font-medium"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNext();
            }}
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 font-medium text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-auto pt-6"
      >
        <button
          onClick={handleNext}
          disabled={!data.name || !data.mobile || !data.email}
          className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Step0Identification;
