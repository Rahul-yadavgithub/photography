import React from 'react';
import { ArrowRight } from 'lucide-react';

function FooterNewsletter() {
  return (
    <div className="flex flex-col space-y-5">
      <h3 className="text-[13px] font-semibold tracking-[0.1em] text-gray-900 uppercase">STAY UPDATED</h3>
      <p className="text-gray-600 text-[15px] leading-relaxed">
        Subscribe to our newsletter for wedding inspiration and exclusive vendor offers.
      </p>
      <div className="flex w-full mt-2 shadow-sm rounded-md overflow-hidden">
        <input 
          type="email" 
          placeholder="Your email" 
          className="flex-grow px-4 py-3.5 bg-[#f8fafc] border-y border-l border-gray-200 focus:outline-none focus:bg-white text-[15px]"
        />
        <button className="bg-black text-white px-5 py-3.5 hover:bg-gray-800 transition-colors flex items-center justify-center">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default FooterNewsletter;
