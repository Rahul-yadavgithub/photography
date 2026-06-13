import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, ChevronRight, Film, X, Camera, Smartphone } from 'lucide-react';
import { getFilmCategoryBySlug, getFilmsByCategory, getReelsByCategory } from '../api/filmService';
import PremiumVideoGallery from '../components/common/PremiumVideoGallery';
import PremiumVideoModal from '../components/shared/PremiumVideoModal';
import PremiumLoader from '../components/shared/PremiumLoader';
import useSEO from '../hooks/useSEO';

export default function FilmCategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  
  useSEO({ title: category ? category.name : null, customSeoTitle: category?.seoTitle, customSeoDescription: category?.seoDescription });
  const [films, setFilms] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const reelsContainerRef = useRef(null);
  const [reelsOverflow, setReelsOverflow] = useState(false);
  const btsContainerRef = useRef(null);
  const [btsOverflow, setBtsOverflow] = useState(false);

  useEffect(() => {
    const checkReelsOverflow = () => {
      if (reelsContainerRef.current) {
        const { scrollWidth, clientWidth } = reelsContainerRef.current;
        setReelsOverflow(scrollWidth > clientWidth);
      }
    };
    // Run after a short delay to ensure DOM is painted
    const timer = setTimeout(checkReelsOverflow, 150);
    window.addEventListener('resize', checkReelsOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkReelsOverflow);
    };
  }, [reels]);

  useEffect(() => {
    const checkBtsOverflow = () => {
      if (btsContainerRef.current) {
        const { scrollWidth, clientWidth } = btsContainerRef.current;
        setBtsOverflow(scrollWidth > clientWidth);
      }
    };
    // Run after a short delay to ensure DOM is painted
    const timer = setTimeout(checkBtsOverflow, 150);
    window.addEventListener('resize', checkBtsOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkBtsOverflow);
    };
  }, [category]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadCategoryData = async () => {
      setLoading(true);
      const catData = await getFilmCategoryBySlug(slug);
      setCategory(catData);

      if (catData) {
        const [filmsData, reelsData] = await Promise.all([
          getFilmsByCategory(catData.name),
          getReelsByCategory(catData.name)
        ]);
        setFilms(filmsData || []);
        setReels(reelsData || []);
      }
      setLoading(false);
    };
    loadCategoryData();
  }, [slug]);

  // Auto-rotating Hero Banner
  useEffect(() => {
    if (!category || !category.heroBanners || category.heroBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % category.heroBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <PremiumLoader text="CURATING FILMS..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-gray-900 font-sans px-6 text-center">
        <Film className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-3xl md:text-5xl font-serif mb-4">Collection Not Found</h1>
        <Link to="/films" className="mt-8 border border-gray-200 hover:border-gray-900 px-8 py-3 uppercase tracking-widest text-xs font-bold transition-all rounded-sm hover:bg-gray-900 hover:text-white">
          Back to Films
        </Link>
      </div>
    );
  }

  // Fallback to coverImage if heroBanners is empty
  const heroImages = category.heroBanners?.length > 0 ? category.heroBanners : (category.coverImage ? [category.coverImage] : ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80']);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 pb-24">

      {/* Premium Compact Hero */}
      <section className="relative w-full h-[370px] flex flex-col items-center justify-center overflow-hidden bg-black -mt-24 pt-24">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={img}
              alt={`${category.name} Banner ${idx + 1}`}
              className="w-full h-full object-cover object-center opacity-60"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-bold mb-4 drop-shadow-md">
            Explore Our Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight drop-shadow-xl">{category.name}</h1>
          <p className="text-sm md:text-base text-white/90 max-w-xl font-light leading-relaxed drop-shadow-md">
            {category.description || 'A cinematic collection of our finest moments and stories.'}
          </p>
        </div>
      </section>

      {/* Main Content Area - White theme for premium readability */}
      <div className="bg-white relative z-20 px-4 sm:px-6 md:px-12 py-16 border-t border-gray-100">

        {/* Films Grid */}
        <section className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-16">
            <h2 className="text-3xl font-serif text-gray-900">Cinematic Stories</h2>
          </div>

          {films.length === 0 ? (
            <div className="max-w-xl mx-auto bg-[#f8fafc] rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                <Film className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-2">Collection in Progress</h3>
              <p className="text-gray-700 text-sm">We're currently preparing this exclusive cinematic collection. Please check back soon.</p>
            </div>
          ) : (
            <PremiumVideoGallery films={films} onCardClick={setActiveVideo} />
          )}
        </section>

        {/* Reels Section */}
        {reels.length > 0 && (
          <section className="max-w-7xl mx-auto mt-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-gray-900">Social Highlights</h2>
              <p className="text-sm text-gray-700 mt-2">Bite-sized moments captured perfectly.</p>
            </div>

            {/* Intelligent Reels Layout Engine */}
            <div
              ref={reelsContainerRef}
              className={`flex gap-6 pb-8 snap-x snap-mandatory w-full ${reelsOverflow ? 'overflow-x-auto hide-scrollbar justify-start' : 'justify-center flex-wrap'}`}
            >
              {reels.map((reel, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveVideo(reel)}
                  className="premium-card shrink-0 w-[260px] md:w-[280px] aspect-[9/16] relative overflow-hidden group cursor-pointer snap-center"
                >
                  {reel.thumbnail ? (
                    <img src={reel.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={reel.title} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-80 mix-blend-overlay bg-gradient-to-br from-purple-600 via-pink-500 to-[#ea580c] absolute inset-0">
                      <Smartphone className="w-16 h-16 text-white/50 mb-4" />
                      <span className="text-white/50 text-[10px] tracking-widest font-bold uppercase text-center px-4">Social Highlight</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                  <span className="absolute top-5 right-5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest shadow-sm">
                    {reel.duration}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 border border-white/30">
                      <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-white font-bold text-base leading-tight drop-shadow-lg">{reel.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Behind The Scenes (BTS) Gallery */}
        {category.btsGallery && category.btsGallery.length > 0 && (
          <section className="max-w-7xl mx-auto mt-32">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block flex items-center justify-center gap-2">
                <Camera className="w-3 h-3" /> Behind The Lens
              </span>
              <h2 className="text-3xl font-serif text-gray-900">Production Moments</h2>
            </div>

            <div
              ref={btsContainerRef}
              className={`flex gap-6 pb-8 snap-x snap-mandatory w-full ${btsOverflow ? 'overflow-x-auto hide-scrollbar justify-start' : 'justify-center flex-wrap'}`}
            >
              {category.btsGallery.map((img, idx) => (
                <div
                  key={idx}
                  className="premium-card shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] aspect-[16/9] relative overflow-hidden group cursor-pointer snap-center"
                >
                  <img src={img} alt={`BTS ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Premium Media Viewer Overlay */}
      <PremiumVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
