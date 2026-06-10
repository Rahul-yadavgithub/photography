import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

function FooterBrandInfo() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2 text-gray-900">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM10 16L5 11L6.41 9.59L10 13.17L17.59 5.58L19 7L10 16Z" />
        </svg>
        <span className="text-2xl font-bold tracking-tight font-sans">book my wed</span>
      </div>
      <p className="text-gray-600 leading-relaxed text-[15px] max-w-sm">
        Discover the world's most extraordinary places to celebrate — from boutique lawns to luxury resorts and private halls.
      </p>
      <div className="flex space-x-5 text-gray-500 mt-2">
        <a href="#" className="hover:text-gray-900 transition-colors"><FaInstagram className="w-5 h-5" /></a>
        <a href="#" className="hover:text-gray-900 transition-colors"><FaFacebookF className="w-5 h-5" /></a>
        <a href="#" className="hover:text-gray-900 transition-colors"><FaTwitter className="w-5 h-5" /></a>
        <a href="#" className="hover:text-gray-900 transition-colors"><FaLinkedinIn className="w-5 h-5" /></a>
      </div>
    </div>
  );
}

export default FooterBrandInfo;
