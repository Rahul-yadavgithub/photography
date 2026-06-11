import React, { useState } from 'react';
import Button from '../common/Button';
import { useIntent } from '../../context/IntentContext';
import { useUser, useClerk } from '@clerk/clerk-react';
import { LogOut, User, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HeaderActions({ isScrolled, forceDarkText }) {
  const navigate = useNavigate();
  const { executeProtectedAction } = useIntent();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const textColor = isScrolled || forceDarkText ? 'text-gray-800' : 'text-white';
  const accentButtonBg = 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:from-[#c2410c] hover:to-[#ea580c] shadow-lg shadow-[#ea580c]/40 hover:shadow-[#ea580c]/60 transform hover:-translate-y-0.5 transition-all duration-300 rounded-full uppercase tracking-wider text-[11px] px-8 py-3 border-none';

  return (
    <div className={`flex items-center space-x-4 lg:space-x-6 xl:space-x-8 text-[15px] font-medium transition-colors duration-700 ${textColor}`}>
      <Button className={accentButtonBg} onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW')}>
        Book Now
      </Button>

      {isSignedIn ? (
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className="flex items-center space-x-2 w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden hover:scale-105 transition-transform"
          >
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 m-auto text-gray-500" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <button onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <User className="w-4 h-4 mr-3 text-gray-400" /> My Profile
              </button>
              <button onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }} className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" /> My Bookings
              </button>
              <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                <Settings className="w-4 h-4 mr-3 text-gray-400" /> Settings
              </button>
              <div className="h-px bg-gray-50 my-1"></div>
              <button onClick={() => signOut()} className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                <LogOut className="w-4 h-4 mr-3 text-red-400" /> Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => executeProtectedAction('LOGIN')}
          className={`text-[11px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity`}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default HeaderActions;
