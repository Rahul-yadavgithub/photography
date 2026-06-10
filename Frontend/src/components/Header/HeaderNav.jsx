import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function HeaderNav({ isScrolled, forceDarkText }) {
  const location = useLocation();
  const isDark = isScrolled || forceDarkText;
  
  const hoverText = isDark ? 'hover:text-primary' : 'hover:text-white/80';
  const textColor = isDark ? 'text-gray-800' : 'text-white';
  const underlineColor = isDark ? 'bg-primary' : 'bg-white';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Wedding Films', path: '/wedding-films' },
    { name: 'Shoot', path: '/shoot' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Buy Product', path: '/store' },
  ];

  return (
    <nav className={`flex items-center space-x-8 text-[16px] font-medium transition-colors duration-700 ${textColor}`}>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
        
        return (
          <Link 
            key={link.name} 
            to={link.path} 
            className={`relative py-1 group transition-colors duration-300 ${isActive && isDark ? 'text-primary' : ''} ${!isActive ? hoverText : ''}`}
          >
            {link.name}
            <span 
              className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full transition-all duration-300 ease-in-out ${underlineColor} ${
                isActive 
                  ? 'scale-x-100 opacity-100' 
                  : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              } origin-left`}
            ></span>
          </Link>
        );
      })}
    </nav>
  );
}

export default HeaderNav;
