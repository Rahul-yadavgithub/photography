import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

import MobileDrawer from './MobileDrawer';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/bookings');
  const forceDarkText = isDashboard;
  const headerBg = isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
  const iconColor = isScrolled || forceDarkText ? 'text-gray-900' : 'text-white';

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${headerBg}`}>
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-5 flex items-center justify-between">
          <div className="flex-1 flex justify-start items-center min-w-[150px]">
            <HeaderLogo isScrolled={isScrolled} forceDarkText={forceDarkText} />
          </div>

          <div className="flex-none hidden lg:flex justify-center px-4">
            <HeaderNav isScrolled={isScrolled} forceDarkText={forceDarkText} />
          </div>

          <div className="flex-1 flex justify-end items-center gap-4 hidden lg:flex min-w-[150px]">
            <HeaderActions isScrolled={isScrolled} forceDarkText={forceDarkText} />
          </div>

          <div className="flex-1 flex justify-end lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className={`p-2 ${iconColor}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

export default Header;
