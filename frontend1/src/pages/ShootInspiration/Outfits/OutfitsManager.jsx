import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shirt } from 'lucide-react';

const mockOutfits = [
  { id: 1, title: 'Royal Sabyasachi Lehenga', category: 'Traditional', status: 'Active', image: 'https://images.unsplash.com/photo-1595988506840-79841cb65bb0?auto=format&fit=crop&q=80&w=600', description: 'Classic red traditional wear for main wedding events.' },
  { id: 2, flow: 'Pastel Floral Anarkali', category: 'Pre-Wedding', status: 'Active', image: 'https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=600', description: 'Light and airy, perfect for daytime outdoor shoots.' },
  { id: 3, title: 'Sharp Tuxedo', category: 'Western', status: 'Active', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', description: 'Modern and sophisticated look for reception.' },
  { id: 4, title: 'Banarasi Silk Saree', category: 'Traditional', status: 'Draft', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=600', description: 'Timeless elegance for intimate ceremonies.' },
];

const OutfitsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Outfit Inspirations</h2>
          <p className="text-sm text-zinc-500 mt-1">Help clients decide what to wear with editorial-style fashion boards.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search outfits..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add Outfit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockOutfits.map((outfit) => (
          <div key={outfit.id} className="group flex flex-col bg-transparent cursor-pointer">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm mb-3">
              <img src={outfit.image} alt={outfit.title || outfit.flow} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="absolute top-3 left-3 right-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  outfit.status === 'Active' ? 'bg-white/90 text-zinc-900' : 'bg-zinc-800/90 text-white'
                }`}>
                  {outfit.status}
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <button className="p-2 bg-white/90 hover:bg-white text-zinc-900 rounded-lg shadow-sm transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg shadow-sm transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900 text-sm group-hover:text-zinc-600 transition-colors">{outfit.title || outfit.flow}</h3>
                <Shirt className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{outfit.category}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OutfitsManager;
