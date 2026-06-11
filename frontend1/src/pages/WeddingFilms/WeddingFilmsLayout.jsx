import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Film, PlaySquare, FolderTree, Star, Video, LineChart, LayoutDashboard, Camera, Clapperboard, TrendingUp } from 'lucide-react';

const WeddingFilmsLayout = () => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', path: '/films', icon: LayoutDashboard, exact: true },
    { id: 'categories', name: 'Categories', path: '/films/categories', icon: FolderTree },
    { id: 'signature', name: 'Signature Films', path: '/films/signature', icon: Video },
    { id: 'reels', name: 'Reels & Shorts', path: '/films/reels', icon: PlaySquare },
    { id: 'bts', name: 'BTS Gallery', path: '/films/bts', icon: Camera },
    { id: 'collections', name: 'Collections', path: '/films/collections', icon: Clapperboard },
    { id: 'analytics', name: 'Analytics', path: '/films/analytics', icon: TrendingUp },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 font-sans text-zinc-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Films Management</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage all your cinematic content and video categories.</p>
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

export default WeddingFilmsLayout;
