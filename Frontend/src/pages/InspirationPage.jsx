import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown, Play, Maximize2, Camera, Clock, Info, Check, X, Bookmark, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- DATA ---
const CATEGORIES = [
  "Pre-Wedding Poses", "Wedding Day Poses", "Bride Solo Poses", 
  "Groom Solo Poses", "Couple Poses", "Engagement Poses", 
  "Destination Shoot Ideas", "Candid Moments", "Drone Shot Ideas", 
  "Instagram Reel Ideas", "Cinematic Video Shots", "Traditional Poses", 
  "Luxury Editorial Poses"
];

const COLLECTIONS = [
  { title: "Royal Palace Collection", poses: 45, duration: "4 Hours", outfits: "2-3 Outfits", thumb: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800" },
  { title: "Golden Hour Romance", poses: 32, duration: "2 Hours", outfits: "1 Outfit", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { title: "Beach Sunset Collection", poses: 28, duration: "2 Hours", outfits: "Flowy Dresses", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" },
];

const POSES = [
  { id: 1, title: "Forehead Touch", difficulty: "Easy", type: "Couple Pose", thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600", description: "Stand close together with foreheads touching while maintaining natural eye contact.", bestTime: "Golden Hour", bestLens: "85mm", aspect: "aspect-[3/4]" },
  { id: 2, title: "The Twirl", difficulty: "Medium", type: "Action Shot", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600", description: "Groom spins the bride gently. Perfect for showcasing the flow of the dress.", bestTime: "Sunset", bestLens: "35mm", aspect: "aspect-square" },
  { id: 3, title: "Looking Away", difficulty: "Easy", type: "Editorial", thumb: "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=600", description: "Couple looks off into the distance, deep in thought.", bestTime: "Morning", bestLens: "50mm", aspect: "aspect-[4/3]" },
  { id: 4, title: "Back Hug", difficulty: "Easy", type: "Intimate", thumb: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600", description: "Groom hugs bride from behind, whispering into her ear.", bestTime: "Anytime", bestLens: "85mm", aspect: "aspect-[3/4]" },
  { id: 5, title: "Walking Together", difficulty: "Easy", type: "Candid", thumb: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600", description: "Holding hands and walking towards the camera while laughing.", bestTime: "Late Afternoon", bestLens: "70-200mm", aspect: "aspect-square" },
  { id: 6, title: "Silhouette Embrace", difficulty: "Hard", type: "Creative", thumb: "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&q=80&w=600", description: "Couple embracing in front of a strong backlight or sunset.", bestTime: "Sunset", bestLens: "35mm", aspect: "aspect-[4/3]" },
  { id: 7, title: "Bride Looking Down", difficulty: "Easy", type: "Solo", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600", description: "A quiet, elegant moment of the bride adjusting her dress or looking down.", bestTime: "Daytime", bestLens: "50mm", aspect: "aspect-[3/4]" },
];

const VIDEOS = [
  { id: 101, title: "Drone Fly-In", category: "Aerial", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" },
  { id: 102, title: "Bride Reveal", category: "Emotional", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" },
  { id: 103, title: "Slow Motion Entry", category: "Grand", thumb: "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=600" },
  { id: 104, title: "Ring Close-Up", category: "Detail", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" },
  { id: 105, title: "Sunset Silhouette", category: "Cinematic", thumb: "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&q=80&w=600" },
];

// --- COMPONENTS ---

const HeroSection = () => (
  <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="https://cdn.coverr.co/videos/coverr-temp-dfwgwipes-mov-3172/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-32 pb-20">
      <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
        Find Your Perfect <br/><span className="italic text-[#ea580c]">Shoot Style</span>
      </h1>
      <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl font-light tracking-wide leading-relaxed">
        Explore hundreds of pose ideas, cinematic shots, and creative inspirations for your pre-wedding, wedding, couple, and destination shoots.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button className="bg-white text-black px-10 py-4 rounded-sm hover:bg-gray-200 transition-all duration-300 tracking-widest text-xs font-bold uppercase shadow-xl">
          Explore Inspirations
        </button>
        <button className="border border-white/40 text-white backdrop-blur-sm px-10 py-4 rounded-sm hover:bg-white/10 transition-all duration-300 tracking-widest text-xs font-bold uppercase">
          Book Your Shoot
        </button>
      </div>
    </div>
  </section>
);

const BrowseCategoriesSection = () => (
  <section className="py-20 bg-[#f8fafc] relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-wrap justify-center gap-4">
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-full px-6 py-3 cursor-pointer bg-white border border-gray-200 shadow-sm hover:bg-[#ea580c] hover:border-[#ea580c] transition-all duration-300">
            <span className="text-sm font-medium text-gray-600 group-hover:text-white transition-colors tracking-wide">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedCollectionsSection = () => (
  <section className="py-24 bg-white relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Featured Collections</h2>
        <p className="text-gray-600 text-lg">Curated editorial styles for your dream shoot.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map((col, idx) => (
          <div key={idx} className="group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col">
            <div className="w-full h-72 relative overflow-hidden">
              <img src={col.thumb} alt={col.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif text-gray-900 mb-3">{col.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 uppercase tracking-widest font-semibold mb-6">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{col.poses} Poses</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{col.duration}</span>
                </div>
              </div>
              <button className="w-full py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs tracking-widest font-bold uppercase group-hover:bg-[#ea580c] group-hover:text-white group-hover:border-[#ea580c] transition-colors duration-300">
                View Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PoseGallerySection = ({ savedItems, toggleSave, openModal }) => (
  <section className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Pose Inspiration Gallery</h2>
        <p className="text-gray-600 text-lg">Save your favorites to your Inspiration Board.</p>
      </div>
      
      {/* Uniform Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {POSES.map((pose) => {
          const isSaved = savedItems.includes(pose.id);
          return (
            <div key={pose.id} className="relative group rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-gray-100">
                <img src={pose.thumb} alt={pose.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
                
                {/* Save Heart Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSave(pose.id); }}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#ea580c] text-[#ea580c]' : 'text-white'}`} />
                </button>
                
                {/* Quick View */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => openModal(pose)}>
                  <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-full text-xs tracking-widest font-bold uppercase flex items-center space-x-2 hover:bg-[#ea580c] hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                    <span>Quick View</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-serif text-gray-900 mb-3 line-clamp-1">{pose.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold bg-gray-50 px-2 py-1 rounded">{pose.type}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${pose.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : pose.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {pose.difficulty}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const VideoShotSection = () => (
  <section className="py-24 bg-white relative z-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
      <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Cinematic Video Shot Ideas</h2>
      <p className="text-gray-600 text-lg">Must-have sequences for your wedding film.</p>
    </div>
    
    <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 hide-scrollbar cursor-grab active:cursor-grabbing">
      {VIDEOS.map((vid) => (
        <div key={vid.id} className="shrink-0 w-[320px] md:w-[400px] flex flex-col group cursor-pointer">
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6 group-hover:shadow-xl transition-shadow duration-300">
            <img src={vid.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:scale-110 group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-all">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="px-2">
            <span className="text-[#ea580c] text-[10px] font-bold tracking-widest uppercase mb-2 block">{vid.category}</span>
            <h3 className="text-2xl font-serif text-gray-900 group-hover:text-[#ea580c] transition-colors">{vid.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const RecommendedPackagesSection = () => (
  <section className="py-24 bg-[#f8fafc] relative z-20 border-t border-gray-100">
    <div className="max-w-5xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-serif text-gray-900 mb-12 tracking-tight">Turn Inspiration Into Reality</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Package Card 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-serif text-gray-900 mb-4">Essential Pre-Wedding</h3>
          <p className="text-gray-600 text-sm mb-6">Perfect for capturing a concise, beautiful story before the big day.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> 1 Location, 1 Outfit</li>
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> 25 Edited Photos</li>
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> 1 Reel Video</li>
          </ul>
          <Link to="/packages" className="block text-center w-full py-3 border border-gray-300 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
            View Pricing
          </Link>
        </div>
        {/* Package Card 2 */}
        <div className="bg-white border border-[#ea580c]/30 rounded-2xl p-8 hover:shadow-xl hover:border-[#ea580c] transition-all relative">
          <div className="absolute -top-3 left-8 bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-md">Recommended</div>
          <h3 className="text-2xl font-serif text-gray-900 mb-4">Premium Destination</h3>
          <p className="text-gray-600 text-sm mb-6">The ultimate cinematic experience at breathtaking locations.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> Multiple Locations & Outfits</li>
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> Cinematic Drone Footage</li>
            <li className="flex items-center text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-[#ea580c] mr-3" /> 3 Social Media Reels</li>
          </ul>
          <Link to="/packages" className="block text-center w-full py-3 bg-[#ea580c] text-white rounded hover:bg-[#c2410c] transition-colors font-bold uppercase text-xs tracking-widest shadow-md">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CtaSection = () => (
  <section className="relative py-32 bg-black flex items-center justify-center border-t border-gray-100 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200" alt="Cinematic Couple" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>
    </div>
    <div className="relative z-10 text-center max-w-2xl px-6">
      <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Ready To Create These Memories?</h2>
      <p className="text-white/80 text-lg mb-10 font-light">Let's turn your inspiration into reality. Book your shoot today.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/packages" className="bg-[#ea580c] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#c2410c] transition-colors shadow-[0_0_20px_rgba(234,88,12,0.4)]">Book Your Shoot</Link>
        <button className="bg-transparent border border-white text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors backdrop-blur-sm">Talk To Our Team</button>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

export default function InspirationPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [modalPose, setModalPose] = useState(null);

  const toggleSave = (id) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 relative">
      <HeroSection />
      <BrowseCategoriesSection />
      <FeaturedCollectionsSection />
      <PoseGallerySection savedItems={savedItems} toggleSave={toggleSave} openModal={setModalPose} />
      <VideoShotSection />
      <RecommendedPackagesSection />
      <CtaSection />
      
      {/* Floating Save Button */}
      {savedItems.length > 0 && (
        <button className="fixed bottom-8 right-8 z-[90] bg-[#ea580c] text-white px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(234,88,12,0.4)] flex items-center space-x-3 hover:scale-105 transition-transform animate-in slide-in-from-bottom-10 fade-in duration-500">
          <Bookmark className="w-5 h-5 fill-white" />
          <span className="font-bold tracking-wider text-sm">View Board ({savedItems.length})</span>
        </button>
      )}

      {/* Pose Detail Modal */}
      {modalPose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <button onClick={() => setModalPose(null)} className="absolute top-6 right-6 text-white/50 hover:text-white z-50 bg-black/50 p-2 rounded-full backdrop-blur-md">
            <X className="w-6 h-6" />
          </button>
          
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            
            {/* Left Image */}
            <div className="w-full md:w-3/5 h-[40vh] md:h-[90vh] bg-[#f8fafc] relative">
              <img src={modalPose.thumb} alt={modalPose.title} className="w-full h-full object-contain" />
            </div>

            {/* Right Details */}
            <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[#ea580c] text-[10px] font-bold tracking-widest uppercase mb-2 block">{modalPose.type}</span>
                  <h2 className="text-3xl font-serif text-gray-900">{modalPose.title}</h2>
                </div>
                <button onClick={() => toggleSave(modalPose.id)} className="p-3 rounded-full bg-[#f8fafc] hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
                  <Heart className={`w-6 h-6 transition-colors ${savedItems.includes(modalPose.id) ? 'fill-[#ea580c] text-[#ea580c]' : 'text-gray-400'}`} />
                </button>
              </div>

              <p className="text-gray-600 text-base leading-relaxed mb-10 font-light">
                {modalPose.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center text-gray-500 mb-2 space-x-2"><Clock className="w-4 h-4"/> <span className="text-[10px] uppercase tracking-widest font-bold">Best Time</span></div>
                  <p className="text-gray-900 font-medium">{modalPose.bestTime}</p>
                </div>
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center text-gray-500 mb-2 space-x-2"><Camera className="w-4 h-4"/> <span className="text-[10px] uppercase tracking-widest font-bold">Best Lens</span></div>
                  <p className="text-gray-900 font-medium">{modalPose.bestLens}</p>
                </div>
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl col-span-2 flex items-center justify-between">
                  <div className="flex items-center text-gray-500 space-x-2"><Info className="w-4 h-4"/> <span className="text-[10px] uppercase tracking-widest font-bold">Difficulty Level</span></div>
                  <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded ${modalPose.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : modalPose.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {modalPose.difficulty}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <Link to="/packages" className="w-full block text-center py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#ea580c] transition-colors shadow-lg">
                  Book This Shoot Style
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
