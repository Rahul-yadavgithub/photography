import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Star, Heart, MessageCircle } from 'lucide-react';
import { useReelsApi } from '../../../api/films';

const ReelsList = () => {
  const { loading, fetchReels } = useReelsApi();
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const loadReels = async () => {
      const data = await fetchReels();
      setReels(data || []);
    };
    loadReels();
  }, [fetchReels]);

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
          to="/films/reels/create" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Upload Reel
        </Link>
      </div>

      {/* Grid Layout (Vertical/Portrait Focus) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Loading reels...</div>
        ) : reels.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">No reels found.</div>
        ) : reels.map((reel) => (
          <Link key={reel._id || reel.id} to={`/films/reels/edit/${reel._id || reel.id}`} className="group relative bg-zinc-100 rounded-2xl overflow-hidden aspect-[9/16] shadow-sm hover:shadow-xl transition-all duration-300">
            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Badges Top */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${
                reel.status === 'Published' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
              }`}>
                {reel.status}
              </span>
              {reel.trending && (
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
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default ReelsList;
