import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Step3Requirements = ({ data, updateData, onNext }) => {
  const [localReqs, setLocalReqs] = useState(data.requirements || {});

  // Pre-fill default requirements based on type if empty
  useEffect(() => {
    if (Object.keys(localReqs).length === 0) {
      if (data.enquiryType === 'Wedding') {
        setLocalReqs({ photographers: '2', videographers: '2', drone: 'No', cinematic: 'Yes' });
      } else if (data.enquiryType === 'Pre Wedding') {
        setLocalReqs({ photographers: '1', videographers: '1', location: 'Local' });
      } else if (data.enquiryType === 'Corporate Event') {
        setLocalReqs({ teamSize: '50-100', duration: 'Half Day' });
      } else {
        setLocalReqs({ details: '' }); // Generic
      }
    }
  }, [data.enquiryType]);

  const handleChange = (key, value) => {
    setLocalReqs(prev => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    updateData({ requirements: localReqs });
    onNext();
  };

  const renderField = (key, label, options) => {
    return (
      <div className="space-y-2 mb-5" key={key}>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">{label}</label>
        <div className="relative">
          <select
            value={localReqs[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Select an option</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    );
  };

  const renderGeneric = () => {
    return (
      <div className="space-y-2 mb-5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Additional Details</label>
        <textarea
          value={localReqs.details || ''}
          onChange={(e) => handleChange('details', e.target.value)}
          placeholder="Tell us a bit more about your shoot..."
          rows={4}
          className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl text-gray-900 text-base focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
        ></textarea>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Shoot Requirements</h2>
        <p className="text-gray-500 text-sm">Let us know what you need for your {data.enquiryType}.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-1">
        <AnimatePresence mode="popLayout">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {data.enquiryType === 'Wedding' && (
              <>
                {renderField('photographers', 'Number of Photographers', ['1', '2', '3', '4+'])}
                {renderField('videographers', 'Number of Videographers', ['1', '2', '3', '4+'])}
                {renderField('drone', 'Drone Required', ['Yes', 'No'])}
                {renderField('cinematic', 'Cinematic Video Required', ['Yes', 'No'])}
              </>
            )}
            
            {data.enquiryType === 'Pre Wedding' && (
              <>
                {renderField('photographers', 'Photographer Count', ['1', '2'])}
                {renderField('videographers', 'Videographer Count', ['1', '2', 'None'])}
                {renderField('location', 'Location Type', ['Local', 'Outstation / Destination', 'International'])}
              </>
            )}

            {data.enquiryType === 'Corporate Event' && (
              <>
                {renderField('teamSize', 'Expected Crowd / Team Size', ['Under 50', '50-100', '100-500', '500+'])}
                {renderField('duration', 'Duration of Event', ['Couple of Hours', 'Half Day', 'Full Day', 'Multi-Day'])}
              </>
            )}

            {/* Fallback for other categories */}
            {['Wedding', 'Pre Wedding', 'Corporate Event'].indexOf(data.enquiryType) === -1 && renderGeneric()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step3Requirements;
