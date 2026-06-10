import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Camera, Image as ImageIcon, Film, MapPin, Shirt, Star } from 'lucide-react';

const ShootInspirationLayout = () => {
  const tabs = [
    { name: 'Pose Categories', path: '/shoot', icon: Camera, exact: true },
    { name: 'Pose Collections', path: '/shoot/poses', icon: ImageIcon },
    { name: 'Reel Inspirations', path: '/shoot/reels', icon: Film },
    { name: 'Location Inspirations', path: '/shoot/locations', icon: MapPin },
    { name: 'Outfit Inspirations', path: '/shoot/outfits', icon: Shirt },
    { name: 'Featured Collections', path: '/shoot/collections', icon: Star },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 font-sans text-zinc-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Shoot Inspiration</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage your premium visual collections for clients.</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white border border-zinc-200 rounded-xl p-1.5 flex overflow-x-auto scrollbar-hide shadow-sm mb-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.exact}
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
              ${isActive 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="animate-in fade-in duration-500">
        <Outlet />
      </div>
    </div>
  );
};

export default ShootInspirationLayout;
