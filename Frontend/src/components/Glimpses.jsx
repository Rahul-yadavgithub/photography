import React, { useRef, useState, useEffect } from 'react';

import { getPortfolioGallery } from '../api/portfolioService';

function Glimpses() {
  const galleryRef = useRef(null);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const galleryImages = await getPortfolioGallery();
      setImages(galleryImages && galleryImages.length > 0 ? galleryImages : [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800'
      ]);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    let animationId;
    const scroll = () => {
      if (galleryRef.current && !isGalleryPaused) {
        galleryRef.current.scrollLeft += 1;
        if (galleryRef.current.scrollLeft >= galleryRef.current.scrollWidth / 2) {
          galleryRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isGalleryPaused]);

  return (
    <section className="bg-[#181d18] py-24 w-full relative overflow-hidden">
      {/* Subtle top/bottom glow effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d65b69]/30 to-transparent"></div>

      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight text-center">
            Glimpses of Magical Weddings
          </h2>
          <p className="text-gray-400 text-center max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Witness the magical moments captured by our photographers. A visual testament to our commitment to making your day perfectly special.
          </p>
        </div>

        {/* Scrolling Marquee Gallery */}
        <div className="relative mt-12 w-full overflow-hidden flex items-center py-4 hide-scrollbar">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#181d18] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#181d18] to-transparent z-10 pointer-events-none"></div>

          <div
            className="flex w-full overflow-x-auto gap-6 md:gap-8 px-4 py-2 cursor-grab active:cursor-grabbing hide-scrollbar"
            ref={galleryRef}
            onMouseEnter={() => setIsGalleryPaused(true)}
            onMouseLeave={() => setIsGalleryPaused(false)}
            onTouchStart={() => setIsGalleryPaused(true)}
            onTouchEnd={() => setIsGalleryPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* First Set of Images */}
            {images.map((url, idx) => (
              <div
                key={`img-${idx}`}
                className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer border border-white/5"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={url} alt="Wedding Glimpse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
            {/* Duplicate Set of Images */}
            {images.map((url, idx) => (
              <div
                key={`img-dup-${idx}`}
                className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer border border-white/5"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={url} alt="Wedding Glimpse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Glimpses;
