import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-[95vh] flex flex-col justify-between mb-12">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0 bg-gray-900 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://cdn.coverr.co/videos/coverr-temp-dfwgwipes-mov-3172/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Soft elegant gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-900/90"></div>
      </div>

      {/* Hero Content (empty center to let video shine) */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 text-center px-4">
      </div>

      {/* Elegant Editorial Card (Lowered Position) */}
      <div className="absolute -bottom-12 left-0 right-0 z-10 flex flex-col items-center w-full px-4 sm:px-8">

        <div
          className={`bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-14 w-full max-w-[1050px] mx-auto flex flex-col items-center justify-center text-center gap-10 transform transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          `}
        >
          {/* Centered Text Content */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-[#ea580c]"></div>
              <span className="text-white/80 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
                Timeless Moments, Captured Forever
              </span>
              <div className="w-8 h-[1px] bg-[#ea580c]"></div>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-sans font-light mb-8 tracking-tight leading-[1.1] bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.6) 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmerEffect 3s linear infinite'
              }}
            >
              Shubham Photo Studio
            </h2>
            <style>{`
              @keyframes shimmerEffect {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}</style>

            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl font-light mb-10">
              We craft cinematic visual stories with unparalleled artistic vision. Let us preserve your most magical day in a masterpiece you'll cherish for a lifetime.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto shrink-0 justify-center">
              <Link
                to="/portfolio"
                className="flex items-center justify-center bg-[#ea580c] text-white px-10 py-4 font-medium tracking-[0.2em] text-[11px] uppercase hover:bg-white hover:text-gray-900 transition-colors duration-500 rounded-sm"
              >
                View Our Masterpieces
              </Link>

              <button className="flex items-center justify-center gap-3 px-10 py-4 text-white font-medium tracking-[0.2em] text-[11px] uppercase border border-white/20 hover:bg-white/10 transition-colors duration-500 rounded-sm group">
                <Play className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity" />
                Watch Showreel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
