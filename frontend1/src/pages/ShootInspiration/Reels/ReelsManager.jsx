import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Video, Star, Eye, UploadCloud } from 'lucide-react';

const mockReels = [
  { id: 1, title: 'Bride Entry Magic', category: 'Bride Entry Reel', duration: '0:30', featured: true, status: 'Published', views: '15.2k', thumbnail: 'https://images.unsplash.com/photo-1595988506840-79841cb65bb0?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 2, title: 'Haldi Madness', category: 'Haldi Reel', duration: '0:45', featured: false, status: 'Published', views: '8.4k', thumbnail: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 3, title: 'Royal Udaipur Drone Shot', category: 'Drone Reel', duration: '0:15', featured: true, status: 'Published', views: '45.1k', thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 4, title: 'Reception Highlights', category: 'Wedding Teaser', duration: '1:00', featured: false, status: 'Draft', views: '-', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=400&h=700' },
  { id: 5, title: 'Pre-Wedding Transitions', category: 'Transition Reel', duration: '0:20', featured: false, status: 'Published', views: '22.8k', thumbnail: 'https://images.unsplash.com/photo-1563814838634-921d7b69a91d?auto=format&fit=crop&q=80&w=400&h=700' },
];

const ReelsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Reel Inspirations</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage vertical short-form video inspirations for your clients.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search reels..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Upload Reel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mockReels.map((reel) => (
          <div key={reel.id} className="group relative bg-zinc-100 rounded-2xl overflow-hidden aspect-[9/16] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
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

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                  <Video className="w-6 h-6 text-white" />
               </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/20 backdrop-blur-md self-start px-2 py-0.5 rounded-md">
                {reel.category}
              </span>
              <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{reel.title}</h3>
              <div className="flex items-center justify-between text-white/80 text-xs font-medium">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {reel.views}</span>
                <span>{reel.duration}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-lg transition-colors border border-white/20 flex items-center justify-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white rounded-lg transition-colors border border-red-500/20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-zinc-900">Upload Reel Inspiration</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Video Source</label>
                <div className="flex gap-4">
                  <button className="flex-1 py-2.5 bg-zinc-900 text-white font-bold rounded-xl text-sm border-2 border-zinc-900">Direct Upload</button>
                  <button className="flex-1 py-2.5 bg-white text-zinc-600 font-bold rounded-xl text-sm border-2 border-zinc-200 hover:border-zinc-300">Instagram URL</button>
                  <button className="flex-1 py-2.5 bg-white text-zinc-600 font-bold rounded-xl text-sm border-2 border-zinc-200 hover:border-zinc-300">YouTube Shorts</button>
                </div>
              </div>

              <div className="w-full h-32 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-500 transition-colors group">
                  <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-zinc-500" />
                  </div>
                  <span className="font-bold text-zinc-900 text-sm">Upload Vertical Video</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Reel Title</label>
                    <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" placeholder="e.g. Epic Bride Entry" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Category</label>
                    <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 appearance-none">
                      <option>Bride Entry Reel</option>
                      <option>Haldi Reel</option>
                      <option>Wedding Teaser</option>
                    </select>
                  </div>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg transition-all hover:-translate-y-0.5">Save Reel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsManager;
