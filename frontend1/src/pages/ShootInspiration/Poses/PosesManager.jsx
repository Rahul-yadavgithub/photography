import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Star } from 'lucide-react';

const mockPoses = [
  { id: 1, title: 'Forehead Touch', category: 'Wedding Poses', featured: true, status: 'Published', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'The Twirl', category: 'Pre-Wedding Poses', featured: false, status: 'Published', image: 'https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Veil Flying', category: 'Bride Solo Poses', featured: true, status: 'Published', image: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Adjusting Cufflinks', category: 'Groom Solo Poses', featured: false, status: 'Draft', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'Walking Away', category: 'Couple Stories', featured: false, status: 'Published', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600' },
  { id: 6, title: 'Laughing Candidly', category: 'Wedding Poses', featured: true, status: 'Published', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600' },
];

const PosesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Pose Collections</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage individual poses. This is the heart of the Shoot Inspiration module.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search poses..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Upload Pose
          </button>
        </div>
      </div>

      {/* Standard Grid Layout (Matching Categories Page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPoses.map((pose) => (
          <div 
            key={pose.id} 
            onClick={() => setSelectedImage(pose.image)}
            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="w-full aspect-[4/5] bg-zinc-100 relative overflow-hidden">
              <img 
                src={pose.image} 
                alt={pose.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Badges - Top */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  pose.status === 'Published' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                  {pose.status}
                </span>
                {pose.featured && (
                  <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-full">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </div>

              {/* Content - Bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md self-start px-2 py-0.5 rounded-md">
                  {pose.category}
                </span>
                <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md">{pose.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle Edit */ }}
                    className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-lg transition-colors border border-white/20 flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle Delete */ }}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white rounded-lg transition-colors border border-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Create Pose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
            
            {/* Image Upload Area */}
            <div className="w-full md:w-2/5 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-100 p-6 flex flex-col items-center justify-center min-h-[250px]">
              <div className="w-full h-full border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-500 transition-colors group p-6 text-center">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-zinc-500" />
                </div>
                <span className="font-bold text-zinc-900">Upload Pose Image</span>
                <span className="text-xs text-zinc-500">Vertical (4:5) format recommended</span>
              </div>
            </div>

            {/* Form Area */}
            <div className="w-full md:w-3/5 flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-xl font-bold text-zinc-900">Add New Pose</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
              </div>
              
              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Pose Title</label>
                  <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" placeholder="e.g. Forehead Touch" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Category</label>
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 appearance-none">
                    <option>Wedding Poses</option>
                    <option>Pre-Wedding Poses</option>
                    <option>Couple Stories</option>
                    <option>Bride Solo Poses</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Short Description</label>
                  <textarea rows="2" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 resize-none" placeholder="A romantic pose where the couple gently touches foreheads..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                      <span className="text-sm font-bold text-zinc-700 flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> Featured Pose</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Status</label>
                    <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 appearance-none">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 mt-auto sticky bottom-0">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg transition-all hover:-translate-y-0.5">Save Pose</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fullscreen Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <span className="text-2xl leading-none block mb-1">✕</span>
          </button>
          <img 
            src={selectedImage} 
            alt="Fullscreen Pose" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
      
    </div>
  );
};

export default PosesManager;
