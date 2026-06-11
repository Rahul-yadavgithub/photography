import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ film, onClick }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="premium-card group relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] shrink-0 overflow-hidden cursor-pointer flex flex-col" 
      onClick={() => onClick(film)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-black shrink-0">
        {film.thumbnailType === 'video' && film.thumbnailVideo ? (
          <video 
            ref={videoRef}
            src={film.thumbnailVideo} 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700" 
          />
        ) : (
          <img 
            src={film.thumbnail || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"} 
            alt={film.title} 
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-90 group-hover:opacity-100" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest shadow-sm">
          {film.duration || 'Feature'}
        </span>
 
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-all duration-500 shadow-lg">
            <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col justify-center bg-white">
        <h3 className="text-lg md:text-xl font-serif text-gray-900 group-hover:text-[#ea580c] transition-colors mb-2 line-clamp-1">{film.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{film.description}</p>
      </div>
    </div>
  );
};

export default function PremiumVideoGallery({ films = [], onCardClick }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  useEffect(() => {
    const checkDimensions = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cards = trackRef.current.querySelectorAll('.gallery-card-item');
        const count = films.length;
        
        if (count > 0 && cards.length >= count) {
          let totalWidth = 0;
          for (let i = 0; i < count; i++) {
            totalWidth += cards[i].offsetWidth;
          }
          const gapsWidth = (count - 1) * 32; // gap-8 = 32px
          const fullSetWidth = totalWidth + gapsWidth;
          
          setSingleSetWidth(fullSetWidth);
          setIsOverflowing(fullSetWidth > containerWidth);
        }
      }
    };

    const timer = setTimeout(checkDimensions, 100);

    const observer = new ResizeObserver(checkDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', checkDimensions);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', checkDimensions);
    };
  }, [films]);

  if (films.length === 0) return null;

  // Determine marquee scroll duration based on item count for consistent premium speed
  const scrollDuration = Math.max(25, films.length * 9);
  const displayFilms = isOverflowing ? [...films, ...films] : films;

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden select-none py-10 relative"
    >
      {isOverflowing && singleSetWidth > 0 && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeScroll {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-${singleSetWidth + 32}px, 0, 0); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marqueeScroll ${scrollDuration}s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}} />
      )}

      {/* Match parent container width for perfect alignment */}
      <div className="w-full overflow-visible">
        <div 
          ref={trackRef}
          className={`${isOverflowing ? 'marquee-track gap-8' : 'flex flex-row flex-wrap justify-center gap-8'}`}
        >
          {displayFilms.map((film, idx) => (
            <div key={`${film._id || idx}-${idx}`} className="gallery-card-item shrink-0">
              <VideoCard film={film} onClick={onCardClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
