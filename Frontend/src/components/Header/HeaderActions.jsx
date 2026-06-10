import React from 'react';
import Button from '../common/Button';

function HeaderActions({ isScrolled, forceDarkText }) {
  const textColor = isScrolled || forceDarkText ? 'text-gray-800' : 'text-white';
  const accentButtonBg = 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:from-[#c2410c] hover:to-[#ea580c] shadow-lg shadow-[#ea580c]/40 hover:shadow-[#ea580c]/60 transform hover:-translate-y-0.5 transition-all duration-300 rounded-full uppercase tracking-wider text-[11px] px-8 py-3 border-none';

  return (
    <div className={`flex items-center space-x-6 text-[15px] font-medium transition-colors duration-700 ${textColor}`}>
      <Button className={accentButtonBg}>
        Book Now
      </Button>
    </div>
  );
}

export default HeaderActions;
