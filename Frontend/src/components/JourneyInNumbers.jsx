import React, { useState, useEffect, useRef } from 'react';

// Custom hook for counting up
const useCountUp = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    
    let startTime = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure we hit the exact target at the end
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  // Format with commas for larger numbers
  return count.toLocaleString();
};

// Reusable Counter Card Component
const CounterCard = ({ label, value, startCounting, duration = 2500, suffix = "" }) => {
  const count = useCountUp(value, duration, startCounting);
  
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transform transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] group">
      <div className="text-5xl md:text-6xl font-serif text-white font-light mb-4 tracking-tight group-hover:scale-105 transition-transform duration-500">
        {count}{suffix}
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/60 text-center leading-relaxed">
        {label}
      </div>
    </div>
  );
};

const JourneyInNumbers = () => {
  // Using some elegant fallback numbers while API is pending
  const [stats, setStats] = useState({
    weddingsCovered: 100,
    happyClients: 1000,
    photosDelivered: 5000,
    filmsProduced: 50
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Frontend-only API fetch implementation as requested
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/journey');
        if (response.ok) {
          const data = await response.json();
          setStats({
             weddingsCovered: data.weddingsCovered || stats.weddingsCovered,
             happyClients: data.happyClients || stats.happyClients,
             photosDelivered: data.photosDelivered || stats.photosDelivered,
             filmsProduced: data.filmsProduced || stats.filmsProduced
          });
        }
      } catch (error) {
        // Silently fail and use fallback stats if backend is not yet implemented
        console.log("Stats API not yet implemented, using default fallback numbers.");
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0F172A] py-20 md:py-28 relative overflow-hidden border-b border-white/5">
      {/* Background elegant gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#D4AF37] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
            <span className="text-white/80 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
              Our Legacy
            </span>
            <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-light tracking-tight mb-6">
            Our Journey In Numbers
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Every number represents a unique story, a shared smile, and a magical moment we've had the honor of preserving forever.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <CounterCard label="Weddings Covered" value={stats.weddingsCovered} startCounting={isVisible} suffix="+" />
          <CounterCard label="Happy Clients" value={stats.happyClients} startCounting={isVisible} suffix="+" />
          <CounterCard label="Photos Delivered" value={stats.photosDelivered} startCounting={isVisible} suffix="+" />
          <CounterCard label="Wedding Films Produced" value={stats.filmsProduced} startCounting={isVisible} suffix="+" />
        </div>
      </div>
    </section>
  );
};

export default JourneyInNumbers;
