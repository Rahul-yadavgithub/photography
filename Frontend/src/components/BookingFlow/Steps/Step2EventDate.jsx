import React from 'react';
import { Calendar } from 'lucide-react';

const Step2EventDate = ({ data, updateData, onNext }) => {
  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (e) => {
    updateData({ eventDate: e.target.value });
    setTimeout(onNext, 400); // Auto-advance after selecting date
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full pt-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-3">When is the event?</h2>
        <p className="text-gray-500 text-sm">Select your preferred date.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start mt-8">
        <div className="relative w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-2 block">Event Date</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-4 w-6 h-6 text-gray-400 pointer-events-none" />
            <input
              type="date"
              min={today}
              value={data.eventDate || ''}
              onChange={handleDateChange}
              className="w-full pl-14 pr-5 py-5 bg-gray-50 border-none rounded-2xl text-gray-900 text-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all cursor-pointer min-h-[64px]"
            />
          </div>
        </div>
      </div>
      
      {/* Fallback button if auto-advance is missed or they want to just click next */}
      <div className="mt-auto pt-8">
        <button
          onClick={onNext}
          disabled={!data.eventDate}
          className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step2EventDate;
