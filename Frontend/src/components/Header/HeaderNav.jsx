import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getFilmCategories } from '../../api/filmService';

function HeaderNav({ isScrolled, forceDarkText }) {
  const location = useLocation();
  const [filmCategories, setFilmCategories] = useState([]);
  
  const isDark = isScrolled || forceDarkText;
  const hoverText = isDark ? 'hover:text-[#ea580c]' : 'hover:text-white/80';
  const textColor = isDark ? 'text-gray-800' : 'text-white';
  const underlineColor = 'bg-[#ea580c]';

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getFilmCategories();
      setFilmCategories(data || []);
    };
    fetchCats();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Films', path: '/films', hasDropdown: true },
    { name: 'Shoot', path: '/shoot' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Store', path: '/store' },
  ];

  return (
    <nav className={`flex items-center space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-12 text-[10px] xl:text-[11px] uppercase tracking-[0.15em] font-bold transition-colors duration-700 ${textColor} z-50`}>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
        
        return (
          <div key={link.name} className="relative group py-4">
            <Link 
              to={link.path} 
              className={`relative py-1 flex items-center gap-1 transition-colors duration-300 ${isActive && isDark ? 'text-[#ea580c]' : ''} ${!isActive ? hoverText : ''}`}
            >
              {link.name}
              {link.hasDropdown && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />}
              <span 
                className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full transition-all duration-300 ease-in-out ${underlineColor} ${
                  isActive 
                    ? 'scale-x-100 opacity-100' 
                    : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                } origin-left`}
              ></span>
            </Link>

            {/* Dropdown Menu for Films */}
            {link.hasDropdown && filmCategories.length > 0 && (
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0 w-64">
                <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden py-2 flex flex-col">
                  {filmCategories.map(cat => (
                    <Link 
                      key={cat._id}
                      to={`/films/${cat.slug}`}
                      className="px-6 py-3 text-gray-700 hover:text-[#ea580c] hover:bg-orange-50 transition-colors capitalize tracking-normal font-medium text-sm border-l-2 border-transparent hover:border-[#ea580c]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="h-px bg-gray-100 my-1 mx-4"></div>
                  <Link 
                    to="/films"
                    className="px-6 py-3 text-[#ea580c] hover:bg-orange-50 transition-colors uppercase tracking-widest font-bold text-[10px]"
                  >
                    View All Films
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default HeaderNav;
