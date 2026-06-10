import React from 'react';
import { Plus, Star, FolderHeart, TrendingUp, Sparkles } from 'lucide-react';

const mockCollections = [
  { id: 1, title: 'Editor\'s Choice', items: 12, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 2, title: 'Most Popular Reels', items: 8, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 3, title: 'Premium Weddings', items: 5, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 4, title: 'Couple Stories', items: 15, icon: FolderHeart, color: 'text-rose-500', bg: 'bg-rose-50' },
];

const CollectionsManager = () => {
  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Featured Collections</h2>
          <p className="text-sm text-zinc-500 mt-1">Curate specific videos into beautiful collections for your homepage.</p>
        </div>
        
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          Create Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCollections.map((collection) => (
          <div key={collection.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className={`w-12 h-12 ${collection.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <collection.icon className={`w-6 h-6 ${collection.color}`} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">{collection.title}</h3>
            <p className="text-sm font-medium text-zinc-500">{collection.items} Videos Selected</p>
            
            <div className="mt-6 pt-6 border-t border-zinc-100 flex gap-2">
              <button className="flex-1 py-2 text-sm font-bold text-zinc-900 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">Edit</button>
              <button className="flex-1 py-2 text-sm font-bold text-zinc-900 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">Manage Content</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CollectionsManager;
