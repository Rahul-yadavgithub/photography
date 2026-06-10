import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Film, PlaySquare, FolderTree, Star, Video, LineChart, LayoutDashboard } from 'lucide-react';

const WeddingFilmsLayout = () => {
  const tabs = [
    { name: 'Dashboard', path: '/wedding-films', icon: LayoutDashboard, exact: true },
    { name: 'Signature Films', path: '/wedding-films/signature', icon: Film },
    { name: 'Reels & Shorts', path: '/wedding-films/reels', icon: PlaySquare },
    { name: 'Categories', path: '/wedding-films/categories', icon: FolderTree },
    { name: 'Featured Collections', path: '/wedding-films/collections', icon: Star },
    { name: 'Behind The Scenes', path: '/wedding-films/bts', icon: Video },
    { name: 'Analytics', path: '/wedding-films/analytics', icon: LineChart },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 font-sans text-zinc-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Wedding Films</h1>
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
