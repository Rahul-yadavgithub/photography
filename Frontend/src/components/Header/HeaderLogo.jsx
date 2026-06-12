import React from 'react';
import { Link } from 'react-router-dom';

function HeaderLogo({ isScrolled, forceDarkText }) {
  return (
    <Link to="/" className="flex items-center cursor-pointer group py-1">
      <div className="relative flex items-center justify-center rounded-full transition-all duration-700 hover:scale-110 hover:rotate-3 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.8)]">
        <img 
          src="https://res.cloudinary.com/dzbliymin/image/upload/v1781240581/logo-Photoroom-removebg-preview_uojyrj.png" 
          alt="Shubham Studio Logo" 
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full border-2 border-[#D4AF37]/80"
        />
        {/* Premium subtle glow animation */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-0 group-hover:animate-ping group-hover:opacity-20 transition-opacity duration-700"></div>
      </div>
    </Link>
  );
}

export default HeaderLogo;
