import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const forceDarkText = location.pathname === '/packages';
  const headerBg = isScrolled ? 'bg-white shadow-md' : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 px-10 py-5 flex items-center justify-between transition-all duration-700 ${headerBg}`}>
      <HeaderLogo isScrolled={isScrolled} forceDarkText={forceDarkText} />
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <HeaderNav isScrolled={isScrolled} forceDarkText={forceDarkText} />
      </div>
      <HeaderActions isScrolled={isScrolled} forceDarkText={forceDarkText} />
    </header>
  );
}

export default Header;
