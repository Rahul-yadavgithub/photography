import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Camera } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Wedding Poses', count: 125, featured: 12, status: 'Active', lastUpdated: '2 Days Ago', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', description: 'Classic and candid wedding moments.' },
  { id: 2, name: 'Pre-Wedding Poses', count: 84, featured: 8, status: 'Active', lastUpdated: '1 Week Ago', coverImage: 'https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=800', description: 'Romantic storytelling ideas for couples.' },
  { id: 3, name: 'Bride Solo Poses', count: 45, featured: 5, status: 'Active', lastUpdated: '3 Days Ago', coverImage: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=800', description: 'Elegant and royal bridal portraits.' },
  { id: 4, name: 'Groom Solo Poses', count: 32, featured: 4, status: 'Active', lastUpdated: '1 Month Ago', coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', description: 'Sharp and sophisticated groom portraits.' },
  { id: 5, name: 'Family Group Poses', count: 28, featured: 2, status: 'Active', lastUpdated: '3 Months Ago', coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', description: 'Creative ways to capture the whole family.' },
];

const CategoriesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Pose Categories</h2>
          <p className="text-sm text-zinc-500 mt-1">Organize all your pose inspirations into specific categories.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Category
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <div 
            key={category.id} 
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
          >
            {/* Cover Image Area */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={category.coverImage} 
                alt={category.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  category.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-zinc-500/90 text-white'
                }`}>
                  {category.status === 'Active' ? '✅ Active' : 'Archive'}
                </span>
              </div>
              
              {/* Bottom Content within Image */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1 shadow-sm">{category.name}</h3>
                <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> {category.count} Poses</span>
                  <span>•</span>
                  <span>{category.featured} Featured</span>
                </div>
              </div>
            </div>

            {/* Details Area */}
            <div className="p-5 flex-grow flex flex-col">
              <p className="text-sm text-zinc-600 line-clamp-2 flex-grow">{category.description}</p>
              
              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Updated {category.lastUpdated}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  className="flex-1 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  View Collection
                </button>
                <button className="p-2.5 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-xl font-bold text-zinc-900">Create Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Category Name</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" placeholder="e.g. Wedding Poses" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Category Cover Image</label>
                <div className="w-full h-40 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-500 transition-colors group">
                  <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-zinc-500" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700">Upload high-res cover</span>
                  <span className="text-xs text-zinc-500">Recommended size: 1920x1080px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Short Description</label>
                <textarea rows="2" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 resize-none" placeholder="Classic and candid wedding moments."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Display Order</label>
                  <input type="number" defaultValue="1" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Status</label>
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 appearance-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg transition-all hover:-translate-y-0.5">Save Category</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CategoriesManager;
