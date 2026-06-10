import React from 'react';
import { Percent, Tag, Gift, Star, Clock, Calendar, Sparkles } from 'lucide-react';

const TYPES = [
  { id: 'percentage', title: 'Percentage Discount', desc: 'e.g., 20% OFF. Best for seasonal sales.', icon: Percent, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'flat', title: 'Flat Discount', desc: 'e.g., $500 OFF. Best for direct price reduction.', icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'addon', title: 'Free Add-On', desc: 'e.g., Free Drone Coverage.', icon: Gift, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'product', title: 'Free Product', desc: 'e.g., Free Premium Album.', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'limited', title: 'Limited Time Offer', desc: 'e.g., Ends In 3 Days.', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 'festival', title: 'Festival Offer', desc: 'e.g., Wedding Season Special.', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'custom', title: 'Custom Promotion', desc: 'Create a custom promotional message.', icon: Sparkles, color: 'text-zinc-600', bg: 'bg-zinc-100' },
];

const Step1TypeSelection = ({ formData, setFormData, onNext }) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Select Offer Type</h2>
        <p className="text-zinc-500 mt-1">Choose the kind of promotion you want to run.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setFormData({ ...formData, type: type.id, badgeText: type.title })}
            className={`text-left p-5 rounded-2xl border-2 transition-all ${
              formData.type === type.id 
                ? 'border-zinc-900 bg-zinc-50/50 shadow-md ring-4 ring-zinc-900/5' 
                : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${type.bg}`}>
              <type.icon className={`w-6 h-6 ${type.color}`} />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">{type.title}</h4>
            <p className="text-sm text-zinc-500 mt-1 font-medium">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step1TypeSelection;
