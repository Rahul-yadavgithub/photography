import React, { useState, useEffect } from 'react';
import { X, Navigation, Camera, Video, BookOpen, Radio, Plane, Image as ImageIcon, Film } from 'lucide-react';

export const ADDON_ICONS = {
  drone: { icon: Navigation, label: 'Drone' },
  camera: { icon: Camera, label: 'Camera' },
  video: { icon: Video, label: 'Video' },
  album: { icon: BookOpen, label: 'Album' },
  live: { icon: Radio, label: 'Live' },
  travel: { icon: Plane, label: 'Travel' },
  gallery: { icon: ImageIcon, label: 'Gallery' },
  film: { icon: Film, label: 'Film' }
};

const AddOnModal = ({ isOpen, onClose, onSave, editingAddOn }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    iconKey: 'drone',
    status: 'Active'
  });

  useEffect(() => {
    if (editingAddOn) {
      setFormData(editingAddOn);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        iconKey: 'drone',
        status: 'Active'
      });
    }
  }, [editingAddOn, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h3 className="text-xl font-bold text-zinc-900">{editingAddOn ? 'Edit Add-On' : 'Add Add-On'}</h3>
          <button type="button" onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Add-On Name</label>
              <input 
                type="text" 
                required
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
                placeholder="e.g. Drone Coverage" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Price (₹)</label>
              <input 
                type="number" 
                required
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
                placeholder="5000" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Description</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows="3" 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none resize-none transition-all" 
              placeholder="Aerial cinematic wedding coverage." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700">Add-On Icon</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(ADDON_ICONS).map(([key, { icon: Icon, label }]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({...formData, iconKey: key})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.iconKey === key ? 'border-zinc-900 bg-zinc-50 text-zinc-900 shadow-sm ring-2 ring-zinc-900/5' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600'}`}
                  title={label}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Status</h4>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Active add-ons can be purchased.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.status === 'Active'} onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Active' : 'Inactive'})} className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 shadow-inner"></div>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md">Save Add-On</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOnModal;
