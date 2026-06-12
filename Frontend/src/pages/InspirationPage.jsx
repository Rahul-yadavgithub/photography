import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronDown, Play, Maximize2, Camera, Clock, Info, Check, X, Bookmark, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategories, getAllPublishedPoses, getPublishedPosesByCategory } from '../api/inspirationService';
import useSEO from '../hooks/useSEO';

// --- DATA ---
// Static Data removed. Using dynamic data from API.

const COLLECTIONS = [
  { title: "Royal Palace Collection", poses: 45, duration: "4 Hours", outfits: "2-3 Outfits", thumb: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800" },
  { title: "Golden Hour Romance", poses: 32, duration: "2 Hours", outfits: "1 Outfit", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { title: "Beach Sunset Collection", poses: 28, duration: "2 Hours", outfits: "Flowy Dresses", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" },
];


// --- COMPONENTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const HeroSection = () => (
  <div className="relative w-full min-h-[260px] md:min-h-[320px] bg-[#0a0a0a] flex flex-col justify-center pt-28 pb-14 md:pt-36 md:pb-16 z-10">
    {/* Subtle Background Layer Gradients */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent"></div>
    </div>

    <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl flex flex-col items-center"
      >
        {/* Small Label */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#ea580c]">
            Shoot Inspiration
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-5 tracking-tight leading-[1.1]"
        >
          Find Your Perfect Style
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-zinc-400 max-w-xl font-light leading-relaxed"
        >
          Explore hundreds of pose ideas, cinematic shots, and creative inspirations for your pre-wedding, wedding, couple, and destination shoots.
        </motion.p>
      </motion.div>
    </div>
  </div>
);

const BrowseCategoriesSection = ({ categories, selectedCategory, onSelectCategory }) => (
  <section className="py-20 bg-[#f8fafc] relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-wrap justify-center gap-4">
        <div
          onClick={() => onSelectCategory(null)}
          className={`group relative overflow-hidden rounded-full px-6 py-3 cursor-pointer border shadow-sm transition-all duration-300 ${!selectedCategory ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
          <span className="text-sm font-medium tracking-wide">All Poses</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`group relative overflow-hidden rounded-full px-6 py-3 cursor-pointer border shadow-sm transition-all duration-300 ${selectedCategory === cat._id ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
            <span className="text-sm font-medium tracking-wide">{cat.categoryName}</span>
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
        <h2 className="text-fluid-h2 font-serif text-gray-900 tracking-tight mb-4">Featured Collections</h2>
        <p className="text-gray-600 text-lg">Curated editorial styles for your dream shoot.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map((col, idx) => (
          <div key={idx} className="premium-card group overflow-hidden cursor-pointer flex flex-col">
            <div className="w-full h-72 relative overflow-hidden">
              <img src={col.thumb} alt={col.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif text-gray-900 mb-3">{col.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 uppercase tracking-widest font-semibold mb-6">
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

const PoseGallerySection = ({ poses, savedItems, toggleSave, openModal, loading }) => {
  // Split poses into 2 rows for the marquee
  const half = Math.ceil(poses.length / 2);
  const row1 = poses.slice(0, half);
  const row2 = poses.slice(half);

  const renderRow = (rowPoses, isReverse) => (
    <div className="flex w-full overflow-hidden group/marquee py-4">
      <div className={`flex w-max space-x-6 px-3 ${isReverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover/marquee:[animation-play-state:paused]`}>
        {[...rowPoses, ...rowPoses, ...rowPoses, ...rowPoses].map((pose, idx) => {
          const isSaved = savedItems.includes(pose._id);
          return (
            <div key={`${pose._id}-${idx}`} className="w-[280px] md:w-[320px] premium-card relative group overflow-hidden cursor-pointer flex flex-col shrink-0">
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-gray-100">
                <img src={pose.imageUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600'} alt={pose.poseName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>

                {/* Save Heart Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(pose._id); }}
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

              <div className="p-6 flex-grow flex flex-col justify-between border-x border-b border-gray-100 rounded-b-xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
                <h3 className="text-lg font-serif text-gray-900 mb-3 line-clamp-1">{pose.poseName}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold bg-gray-50 px-2 py-1 rounded line-clamp-1 max-w-[50%]">{pose.categoryId?.categoryName || 'Inspiration'}</span>
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
  );

  return (
    <section className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-fluid-h2 font-serif text-gray-900 tracking-tight mb-4">Pose Inspiration Gallery</h2>
          <p className="text-gray-700 text-lg">Save your favorites to your Inspiration Board.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea580c]"></div>
        </div>
      ) : poses.length === 0 ? (
        <div className="text-center text-gray-600 py-20">No poses found in this category.</div>
      ) : (
        <div className="flex flex-col space-y-4 pb-10">
          {row1.length > 0 && renderRow(row1, false)}
          {row2.length > 0 && renderRow(row2, true)}
        </div>
      )}
    </section>
  );
};


const CtaSection = () => (
  <section className="relative py-32 bg-black flex items-center justify-center border-t border-gray-100 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200" alt="Cinematic Couple" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>
    </div>
    <div className="relative z-10 text-center max-w-2xl px-6">
      <h2 className="text-fluid-hero font-serif text-white mb-6">Ready To Create These Memories?</h2>
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
  useSEO();
  const [savedItems, setSavedItems] = useState([]);
  const [modalPose, setModalPose] = useState(null);

  const [categories, setCategories] = useState([]);
  const [poses, setPoses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      const fetchedPoses = await getAllPublishedPoses();
      setPoses(fetchedPoses);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchCategoryPoses = async () => {
      setLoading(true);
      if (selectedCategory) {
        const fetchedPoses = await getPublishedPosesByCategory(selectedCategory);
        setPoses(fetchedPoses);
      } else {
        const fetchedPoses = await getAllPublishedPoses();
        setPoses(fetchedPoses);
      }
      setLoading(false);
    };

    // We skip the initial load since it's handled above, or we could let this handle all,
    // but React 18 strict mode double fires. This setup is fine since selectedCategory drives it.
    // Actually, to avoid double fetch on mount, we can add a simple condition:
    if (categories.length > 0) {
      fetchCategoryPoses();
    }
  }, [selectedCategory]);

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
      <BrowseCategoriesSection categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <FeaturedCollectionsSection />
      <PoseGallerySection poses={poses} savedItems={savedItems} toggleSave={toggleSave} openModal={setModalPose} loading={loading} />
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
              <img src={modalPose.imageUrl || modalPose.thumb} alt={modalPose.poseName || modalPose.title} className="w-full h-full object-contain" />
            </div>

            {/* Right Details */}
            <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[#ea580c] text-[10px] font-bold tracking-widest uppercase mb-2 block">{modalPose.categoryId?.categoryName || modalPose.type || 'Inspiration'}</span>
                  <h2 className="text-3xl font-serif text-gray-900">{modalPose.poseName || modalPose.title}</h2>
                </div>
                <button onClick={() => toggleSave(modalPose._id || modalPose.id)} className="p-3 rounded-full bg-[#f8fafc] hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
                  <Heart className={`w-6 h-6 transition-colors ${savedItems.includes(modalPose._id || modalPose.id) ? 'fill-[#ea580c] text-[#ea580c]' : 'text-gray-500'}`} />
                </button>
              </div>

              <p className="text-gray-700 text-base leading-relaxed mb-10 font-light">
                {modalPose.shortDescription || modalPose.description || 'A beautiful photography inspiration moment.'}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center text-gray-600 mb-2 space-x-2"><Clock className="w-4 h-4" /> <span className="text-[10px] uppercase tracking-widest font-bold">Best Time</span></div>
                  <p className="text-gray-900 font-medium">{modalPose.bestTime || 'Anytime'}</p>
                </div>
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center text-gray-600 mb-2 space-x-2"><Camera className="w-4 h-4" /> <span className="text-[10px] uppercase tracking-widest font-bold">Best Lens</span></div>
                  <p className="text-gray-900 font-medium">{modalPose.bestLens || 'Standard'}</p>
                </div>
                <div className="bg-[#f8fafc] border border-gray-100 p-4 rounded-xl col-span-2 flex items-center justify-between">
                  <div className="flex items-center text-gray-600 space-x-2"><Info className="w-4 h-4" /> <span className="text-[10px] uppercase tracking-widest font-bold">Difficulty Level</span></div>
                  <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded ${modalPose.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : modalPose.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {modalPose.difficulty || 'All Levels'}
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
