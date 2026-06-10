import React from 'react';
import { Settings2, Eye, Star, Search, CreditCard, Tag } from 'lucide-react';

const ToggleCard = ({ icon: Icon, title, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-zinc-300 transition-all">
    <div className="flex items-start gap-4">
      <div className="p-2.5 bg-zinc-50 rounded-xl text-zinc-600 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-base font-bold text-zinc-900">{title}</h4>
        <p className="text-sm text-zinc-500 mt-0.5 max-w-[240px] leading-relaxed">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 shadow-inner"></div>
    </label>
  </div>
);

const SettingsManager = ({ settings, setSettings }) => {
  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-zinc-100 pb-5">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Package Settings</h2>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Control visibility, operational behavior, and SEO.</p>
      </div>

      {/* Package Status */}
      <div className="bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 inline-flex w-full md:w-auto">
        {['Draft', 'Published', 'Archived'].map(status => (
          <button
            key={status}
            onClick={() => setSettings({ ...settings, status })}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
              settings.status === status 
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Visibility & Behavior Toggles */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-zinc-400" /> Visibility & Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleCard 
            icon={Star} 
            title="Featured Package" 
            description="Highlight this package prominently on your website." 
            checked={settings.isFeatured} 
            onChange={() => toggleSetting('isFeatured')} 
          />
          <ToggleCard 
            icon={Tag} 
            title="Popular Package" 
            description="Adds a 'Most Popular' badge to this package." 
            checked={settings.isPopular} 
            onChange={() => toggleSetting('isPopular')} 
          />
          <ToggleCard 
            icon={CreditCard} 
            title="Show Pricing" 
            description="Display the price. If off, shows 'Contact for Quote'." 
            checked={settings.showPricing} 
            onChange={() => toggleSetting('showPricing')} 
          />
          <ToggleCard 
            icon={Settings2} 
            title="Allow Add-Ons" 
            description="Permit customers to select optional upgrades." 
            checked={settings.allowAddOns} 
            onChange={() => toggleSetting('allowAddOns')} 
          />
        </div>
      </div>

      {/* Availability */}
      <div className="pt-6 border-t border-zinc-100">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Package Availability</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Available', 'Unavailable', 'Seasonal'].map(avail => (
            <button
              key={avail}
              onClick={() => setSettings({ ...settings, availability: avail })}
              className={`p-4 text-center rounded-2xl border-2 transition-all font-bold ${
                settings.availability === avail
                  ? 'border-zinc-900 bg-zinc-50 text-zinc-900 shadow-sm ring-2 ring-zinc-900/5'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              {avail}
            </button>
          ))}
        </div>
        
        {settings.availability === 'Seasonal' && (
          <div className="mt-4 p-5 bg-orange-50 border border-orange-100 rounded-2xl grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-1 block">Available From</label>
              <input type="date" className="w-full p-2.5 rounded-lg border border-orange-200 outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-1 block">Available Until</label>
              <input type="date" className="w-full p-2.5 rounded-lg border border-orange-200 outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* SEO Configuration */}
      <div className="pt-6 border-t border-zinc-100">
        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-zinc-400" /> Search Engine Optimization
        </h3>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">SEO Title</label>
              <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white" placeholder="Optimal title for search engines" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">URL Slug</label>
              <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900 focus-within:bg-white transition-all">
                <span className="px-3 py-3 bg-zinc-100 border-r border-zinc-200 text-zinc-400 text-sm">/packages/</span>
                <input type="text" className="w-full px-3 py-3 bg-transparent outline-none" placeholder="luxury-wedding" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Meta Description</label>
            <textarea rows="2" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white resize-none" placeholder="Brief description to appear in search results."></textarea>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsManager;
