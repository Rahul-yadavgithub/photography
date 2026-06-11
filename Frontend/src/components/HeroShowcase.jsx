import React, { useState, useEffect } from 'react';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1920"
];

const HeroShowcase = ({ collections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract banners or use fallbacks
  const images = React.useMemo(() => {
    if (!collections || collections.length === 0) {
      return FALLBACK_IMAGES.map((img, idx) => ({
        url: img,
        title: "Luxury Collection",
        id: `fallback-${idx}`
      }));
    }

    const validCollections = collections.filter(c => c.banner);
    
    if (validCollections.length === 0) {
      return FALLBACK_IMAGES.map((img, idx) => ({
        url: img,
        title: "Luxury Collection",
        id: `fallback-${idx}`
      }));
    }

    let result = validCollections.map(c => ({
      url: c.banner,
      title: c.name,
      id: c.id
    }));

    // Pad with fallback images to ensure we have at least 3 images for a good loop
    if (result.length < 3) {
      const existingUrls = result.map(r => r.url);
      const availableFallbacks = FALLBACK_IMAGES.filter(img => !existingUrls.includes(img));
      
      const needed = 3 - result.length;
      for (let i = 0; i < needed; i++) {
        result.push({
          url: availableFallbacks[i % availableFallbacks.length] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
          title: "Luxury Collection",
          id: `fallback-pad-${i}`
        });
      }
    }

    return result;
  }, [collections]);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-[250px] md:h-[320px] overflow-hidden bg-gray-900">
      {images.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Subtle dark overlay for premium feel */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src={img.url}
              alt={img.title}
              className={`w-full h-full object-cover object-top transition-transform duration-[6000ms] ease-out origin-top ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}

      {/* Slide Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
        <span className="text-white/90 text-xs tracking-[0.2em] font-medium">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span className="text-white/50 text-xs">/</span>
        <span className="text-white/50 text-xs tracking-[0.2em] font-medium">
          {String(images.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default HeroShowcase;
