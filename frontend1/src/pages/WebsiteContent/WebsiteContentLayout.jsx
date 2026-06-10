import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutTemplate, ImagePlay, Info, BarChart3, ShieldCheck, Grid, MapPin, Share2, PanelBottom, Search, Megaphone, Star } from 'lucide-react';

const WebsiteContentLayout = () => {
  const sections = [
    { name: 'Hero Section', path: '/content/hero', icon: ImagePlay },
  ];

  const globalSettings = [
    { name: 'Contact Info', path: '/content/contact', icon: MapPin },
    { name: 'Social Media', path: '/content/social', icon: Share2 },
    { name: 'Footer', path: '/content/footer', icon: PanelBottom },
    { name: 'SEO Settings', path: '/content/seo', icon: Search },
    { name: 'Announcement Bar', path: '/content/announcement', icon: Megaphone },
  ];

  const renderNavLinks = (links) => (
    links.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        end={link.exact}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
          ${isActive 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }
        `}
      >
        <link.icon className="w-4 h-4" />
        {link.name}
      </NavLink>
    ))
  );

  return (
    <div className="w-full h-[calc(100vh-80px)] overflow-hidden flex -mt-8 -mx-8 sm:mx-0">
      
      {/* CMS Vertical Sidebar */}
      <div className="w-72 bg-white border-r border-zinc-200 h-full flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Website Content</h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">Global Website CMS</p>
        </div>

        <div className="p-4 flex-grow space-y-8">
          
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-3 px-4">Page Sections</h3>
            <nav className="space-y-1">
              {renderNavLinks(sections)}
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-3 px-4">Global Settings</h3>
            <nav className="space-y-1">
              {renderNavLinks(globalSettings)}
            </nav>
          </div>

        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex-1 bg-zinc-50 overflow-y-auto relative h-full">
        <div className="absolute inset-0 p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};

export default WebsiteContentLayout;
