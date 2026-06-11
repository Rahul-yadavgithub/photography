import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, User, Calendar, LogOut, Home, Package, Video, Camera, Image, ShoppingBag, ChevronDown } from 'lucide-react';
import { useIntent } from '../../context/IntentContext';
import { useUser, useClerk } from '@clerk/clerk-react';
import Button from '../common/Button';
import { getFilmCategories } from '../../api/filmService';

const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { executeProtectedAction } = useIntent();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [filmsExpanded, setFilmsExpanded] = useState(false);
  const [filmCategories, setFilmCategories] = useState([]);

  React.useEffect(() => {
    const fetchCats = async () => {
      const data = await getFilmCategories();
      setFilmCategories(data || []);
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Films', path: '/films', icon: Video, hasDropdown: true },
    { name: 'Shoot', path: '/shoot', icon: Camera },
    { name: 'Portfolio', path: '/portfolio', icon: Image },
    { name: 'Store', path: '/store', icon: ShoppingBag },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleBookNow = () => {
    onClose();
    setTimeout(() => {
      executeProtectedAction('OPEN_BOOKING_FLOW');
    }, 300); // wait for drawer animation to close
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-[#111] z-[101] shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="text-white font-bold tracking-widest uppercase text-sm">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar py-6">
              <nav className="px-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                  if (link.hasDropdown) {
                    return (
                      <div key={link.name} className="flex flex-col">
                        <button
                          onClick={() => setFilmsExpanded(!filmsExpanded)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${isActive ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <div className="flex items-center space-x-4">
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-[#ea580c]' : 'text-gray-400'}`} />
                            <span className="font-medium tracking-wide text-sm">{link.name}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${filmsExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {filmsExpanded && filmCategories.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col pl-12 pr-4 space-y-1 mt-1"
                            >
                              {filmCategories.map(cat => (
                                <button
                                  key={cat._id}
                                  onClick={() => handleNavClick(`/films/${cat.slug}`)}
                                  className="w-full text-left py-2 text-sm text-gray-400 hover:text-[#ea580c] transition-colors capitalize"
                                >
                                  {cat.name}
                                </button>
                              ))}
                              <div className="h-px bg-white/10 my-2"></div>
                              <button
                                onClick={() => handleNavClick('/films')}
                                className="w-full text-left py-2 text-[10px] uppercase font-bold tracking-widest text-[#ea580c]"
                              >
                                View All Films
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-colors ${isActive ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? 'text-[#ea580c]' : 'text-gray-400'}`} />
                      <span className="font-medium tracking-wide text-sm">{link.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 mb-4 px-10">
                <div className="h-px w-full bg-white/10"></div>
              </div>

              {/* Account Section */}
              <div className="px-6 space-y-2">
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Account</p>
                {isSignedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 m-auto mt-2.5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>

                    <button onClick={() => handleNavClick('/dashboard')} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium tracking-wide text-sm">My Profile</span>
                    </button>
                    <button onClick={() => handleNavClick('/dashboard')} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium tracking-wide text-sm">My Bookings</span>
                    </button>
                    <button onClick={() => { signOut(); onClose(); }} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-5 h-5 text-red-400" />
                      <span className="font-medium tracking-wide text-sm">Log Out</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => { onClose(); executeProtectedAction('LOGIN'); }} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium tracking-wide text-sm">Log In / Sign Up</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 border-t border-white/10 bg-[#111]">
              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold uppercase tracking-widest text-[11px] rounded-full hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
