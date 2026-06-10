import React from 'react';

const Step2Configuration = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Configure Offer Details</h2>
        <p className="text-zinc-500 mt-1">Set up the specifics for your {formData.type || 'new'} offer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Offer Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            placeholder="e.g. Summer Special 2027" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Badge Text</label>
          <input 
            type="text" 
            name="badgeText" 
            value={formData.badgeText} 
            onChange={handleChange} 
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            placeholder="e.g. 20% OFF" 
          />
        </div>

        {formData.type === 'percentage' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Discount Percentage (%)</label>
            <input 
              type="number" 
              name="discountPercentage" 
              value={formData.discountPercentage} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
              placeholder="20" 
            />
          </div>
        )}

        {formData.type === 'addon' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Select Free Add-On</label>
            <select 
              name="addonId" 
              value={formData.addonId} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="">Select...</option>
              <option value="drone">Drone Coverage</option>
              <option value="live">Live Streaming</option>
              <option value="extra_photographer">Extra Photographer</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-700">Offer Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows="3" 
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none resize-none transition-all" 
          placeholder="Detailed description of what the customer gets." 
        />
      </div>

      <div className="border-t border-zinc-100 pt-6 mt-6">
        <h4 className="text-lg font-bold text-zinc-900 mb-4">Scheduling Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Configuration;
