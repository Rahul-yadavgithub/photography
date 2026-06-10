import React from 'react';
import { Link } from 'react-router-dom';

function HeaderLogo({ isScrolled, forceDarkText }) {
  const textColor = isScrolled || forceDarkText ? 'text-gray-900' : 'text-white';
  const logoSubtextColor = isScrolled || forceDarkText ? 'text-gray-600' : 'text-white/90';

  return (
    <Link to="/" className="flex items-center space-x-2 cursor-pointer">
      <div className={`flex items-center justify-center relative transition-colors duration-700 ${isScrolled || forceDarkText ? 'text-gray-900' : 'text-white'}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM10 16L5 11L6.41 9.59L10 13.17L17.59 5.58L19 7L10 16Z" />
        </svg>
      </div>
      <div>
        <h1 className={`text-[22px] font-bold tracking-tight leading-none font-sans transition-colors duration-700 ${textColor}`}>
          book my wed
        </h1>
        <p className={`text-[10px] tracking-wide mt-0.5 transition-colors duration-700 ${logoSubtextColor}`}>
          Find, Book, Celebrate
        </p>
      </div>
    </Link>
  );
}

export default HeaderLogo;
