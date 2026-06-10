import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Image as ImageIcon } from 'lucide-react';

const mockCollections = [
  { id: 1, title: 'Top 50 Pre-Wedding Poses', items: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=1200', description: 'Our most popular and highly requested pre-wedding poses curated into one ultimate collection.' },
  { id: 2, title: 'Royal Udaipur Inspiration', items: 24, status: 'Active', image: 'https://images.unsplash.com/photo-1590766940554-638c71b122dd?auto=format&fit=crop&q=80&w=1200', description: 'Everything you need for a royal palace shoot: outfits, locations, and poses.' },
  { id: 3, title: 'Trending Couple Reels', items: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1563814838634-921d7b69a91d?auto=format&fit=crop&q=80&w=1200', description: 'The most viral audio and transitions for couple shoots right now.' },
];

const CollectionsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Featured Collections</h2>
          <p className="text-sm text-zinc-500 mt-1">Group poses, reels, locations, and outfits into highly curated premium collections.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollections.map((collection) => (
          <div key={collection.id} className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 w-full overflow-hidden">
              <img src={collection.image} alt={collection.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm bg-white/90 text-zinc-900">
                  {collection.status}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
                <button className="px-5 py-2.5 bg-white text-zinc-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                  Manage Content
                </button>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-zinc-900 mb-1">{collection.title}</h3>
              <p className="text-sm text-zinc-600 line-clamp-2 mb-4 flex-grow">{collection.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
                  <Layers className="w-4 h-4" /> {collection.items} Items
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-400 hover:text-zinc-900 bg-white hover:bg-zinc-100 rounded-lg transition-colors border border-transparent hover:border-zinc-200">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CollectionsManager;
