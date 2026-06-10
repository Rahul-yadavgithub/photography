import React, { useState } from 'react';
import { Plus, Search, MapPin, Edit2, Trash2, Camera, Star } from 'lucide-react';

const mockLocations = [
  { id: 1, name: 'Udaipur City Palace', type: 'Palace Shoot', poses: 45, featured: true, status: 'Active', image: 'https://images.unsplash.com/photo-1590766940554-638c71b122dd?auto=format&fit=crop&q=80&w=1200', description: 'Royal architecture and lake views, perfect for grand traditional outfits.' },
  { id: 2, name: 'Goa Private Beach', type: 'Beach Shoot', poses: 32, featured: true, status: 'Active', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200', description: 'Sunset lighting and crashing waves. Ideal for flowing dresses and candid romance.' },
  { id: 3, name: 'Jaipur Forts', type: 'Heritage Shoot', poses: 28, featured: false, status: 'Active', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200', description: 'Dramatic stone walls and historic grandeur.' },
  { id: 4, name: 'Kerala Backwaters', type: 'Nature Shoot', poses: 18, featured: false, status: 'Draft', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200', description: 'Lush greenery and serene boat house settings.' },
];

const LocationsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Location Inspirations</h2>
          <p className="text-sm text-zinc-500 mt-1">Show customers where specific poses work best.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search locations..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockLocations.map((location) => (
          <div key={location.id} className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-64 w-full overflow-hidden">
              <img src={location.image} alt={location.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  location.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                  {location.status}
                </span>
                {location.featured && (
                  <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md mb-2 inline-block">
                  {location.type}
                </span>
                <h3 className="text-2xl font-bold text-white mb-1 shadow-sm flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> {location.name}
                </h3>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm text-zinc-600 line-clamp-2 mb-4">{location.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                  <Camera className="w-4 h-4" /> {location.poses} Recommended Poses
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
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

export default LocationsManager;
