import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Star, Heart, MessageCircle } from 'lucide-react';

const mockReels = [
  { id: 1, title: 'Epic Bride Entry with Cold Pyros', duration: '0:45', category: 'Bride Entry', status: 'Published', views: '240.5k', likes: '12k', featured: true, thumbnail: 'https://images.unsplash.com/photo-1595988506840-79841cb65bb0?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 2, title: 'Haldi Madness - Full Energy!', duration: '0:30', category: 'Haldi', status: 'Published', views: '150k', likes: '8.4k', featured: false, thumbnail: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 3, title: 'Royal Mehendi Details', duration: '0:60', category: 'Mehendi', status: 'Draft', views: '-', likes: '-', featured: false, thumbnail: 'https://images.unsplash.com/photo-1563814838634-921d7b69a91d?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 4, title: 'Breathtaking Aerial Drone Shots', duration: '0:25', category: 'Drone Reel', status: 'Published', views: '45.2k', likes: '2.1k', featured: true, thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 5, title: 'The Ultimate Reception Party', duration: '0:40', category: 'Reception', status: 'Published', views: '88k', likes: '4.5k', featured: false, thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=400&h=700' },
];

const ReelsList = () => {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search reels..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
          />
        </div>
        
        <Link 
          to="/wedding-films/reels/create" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Upload Reel
        </Link>
      </div>

      {/* Grid Layout (Vertical/Portrait Focus) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {mockReels.map((reel) => (
          <Link key={reel.id} to={`/wedding-films/reels/edit/${reel.id}`} className="group relative bg-zinc-100 rounded-2xl overflow-hidden aspect-[9/16] shadow-sm hover:shadow-xl transition-all duration-300">
            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Badges Top */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${
                reel.status === 'Published' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
              }`}>
                {reel.status}
              </span>
              {reel.featured && (
                <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-full">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              )}
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/20 backdrop-blur-md self-start px-2 py-0.5 rounded-md">
                {reel.category}
              </span>
              <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{reel.title}</h3>
              <div className="flex items-center gap-3 text-white/80 text-xs font-medium">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {reel.views}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {reel.likes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default ReelsList;
