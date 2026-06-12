import React, { useState, useEffect } from 'react';
import { usePackagesApi } from '../../../api/packages';

const Step2Configuration = ({ formData, setFormData }) => {
  const { getPackages } = usePackagesApi();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getPackages();
      if (data?.data) setPackages(data.data);
      else if (data?.packages) setPackages(data.packages);
      else if (Array.isArray(data)) setPackages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageToggle = (pkgId) => {
    setFormData(prev => {
      const current = prev.applicablePackages || [];
      const updated = current.includes(pkgId)
        ? current.filter(id => id !== pkgId)
        : [...current, pkgId];
      return { ...prev, applicablePackages: updated };
    });
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
            placeholder="e.g. Summer Special" 
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

        {formData.type === 'Percentage Discount' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Discount Percentage (%)</label>
            <input 
              type="number" 
              name="discountPercentage" 
              value={formData.discountPercentage || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
              placeholder="20" 
            />
          </div>
        )}

        {formData.type === 'Flat Discount' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Flat Discount (₹)</label>
            <input 
              type="number" 
              name="flatDiscountAmount" 
              value={formData.flatDiscountAmount || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
              placeholder="5000" 
            />
          </div>
        )}

        {['Free Album', 'Free Reel', 'Free Drone Shoot', 'Free Extra Hours', 'Complimentary Gift'].includes(formData.type) && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Add-On / Gift Details</label>
            <input 
              type="text" 
              name="freeAddon" 
              value={formData.freeAddon || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
              placeholder="Describe the free addon..." 
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-700">Offer Description</label>
        <textarea 
          name="description" 
          value={formData.description || ''} 
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
              value={formData.startDate || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 pt-6 mt-6">
        <h4 className="text-lg font-bold text-zinc-900 mb-1">Applicable Packages</h4>
        <p className="text-sm text-zinc-500 mb-4">Select the packages this offer should be applied to.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
          {packages.map(pkg => (
            <label key={pkg._id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.applicablePackages?.includes(pkg._id) ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'}`}>
              <input 
                type="checkbox" 
                checked={formData.applicablePackages?.includes(pkg._id) || false} 
                onChange={() => handlePackageToggle(pkg._id)}
                className="mt-1 w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900">{pkg.name}</span>
                <span className="text-xs text-zinc-500">{pkg.category}</span>
              </div>
            </label>
          ))}
          {packages.length === 0 && <div className="text-sm text-zinc-500 italic py-2">No packages available. Create one first.</div>}
        </div>
      </div>

    </div>
  );
};

export default Step2Configuration;
