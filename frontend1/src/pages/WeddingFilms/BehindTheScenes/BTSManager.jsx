import React from 'react';
import { Plus, Camera, Video, UploadCloud } from 'lucide-react';

const mockBTS = [
  { id: 1, title: 'Drone Setup at Udaipur Palace', type: 'Drone Coverage BTS', date: 'Oct 12, 2023', thumbnail: 'https://images.unsplash.com/photo-1579803815615-120c8b9fb64e?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Editing the Cinematic Teaser', type: 'Editing BTS', date: 'Oct 15, 2023', thumbnail: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Getting the Perfect Ring Shot', type: 'Wedding Shoot BTS', date: 'Nov 02, 2023', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400' }
];

const BTSManager = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Behind The Scenes</h2>
          <p className="text-sm text-zinc-500 mt-1">Showcase your professionalism, equipment, and studio workflow.</p>
        </div>
        
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <UploadCloud className="w-5 h-5" />
          Upload BTS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBTS.map((bts) => (
          <div key={bts.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="w-full aspect-video bg-zinc-100 relative overflow-hidden">
              <img src={bts.thumbnail} alt={bts.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">
                {bts.type}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 leading-tight mb-1">{bts.title}</h3>
              <p className="text-xs text-zinc-500 font-medium">Uploaded {bts.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BTSManager;
