import React from 'react';
import { Monitor, Package, Home, LayoutList, CreditCard } from 'lucide-react';

const SETTINGS = [
  { id: 'packageCard', label: 'Package Card', desc: 'Show badge on package listing cards.', icon: LayoutList },
  { id: 'packageDetails', label: 'Package Details Page', desc: 'Show banner at the top of the package page.', icon: Package },
  { id: 'homepageBanner', label: 'Homepage Banner', desc: 'Display globally on the homepage.', icon: Home },
  { id: 'comparisonTable', label: 'Package Comparison Table', desc: 'Highlight this offer when comparing packages.', icon: Monitor },
  { id: 'checkoutSummary', label: 'Checkout Summary', desc: 'Remind customers of the offer during checkout.', icon: CreditCard },
];

const Step3DisplaySettings = ({ formData, setFormData }) => {
  const toggleSetting = (id) => {
    setFormData(prev => ({
      ...prev,
      displaySettings: {
        ...prev.displaySettings,
        [id]: !prev.displaySettings[id]
      }
    }));
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Display Settings</h2>
        <p className="text-zinc-500 mt-1">Control where this offer appears on your website.</p>
      </div>

      <div className="space-y-4">
        {SETTINGS.map(setting => {
          const isChecked = formData.displaySettings[setting.id];
          return (
            <div 
              key={setting.id}
              onClick={() => toggleSetting(setting.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isChecked 
                  ? 'border-zinc-900 bg-zinc-50/50 shadow-sm' 
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div className="shrink-0 p-3 bg-white border border-zinc-200 rounded-xl shadow-sm">
                <setting.icon className="w-5 h-5 text-zinc-700" />
              </div>
              <div className="flex-grow">
                <h4 className="text-base font-bold text-zinc-900">{setting.label}</h4>
                <p className="text-sm text-zinc-500 font-medium">{setting.desc}</p>
              </div>
              <div className="shrink-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${isChecked ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                  {isChecked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step3DisplaySettings;
