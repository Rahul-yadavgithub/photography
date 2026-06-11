import React, { useState, useEffect } from 'react';
import { Play, Camera, Star, Award, ChevronRight, Video, FileImage, ShieldCheck, MapPin, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPortfolio } from '../api/portfolioService';

// --- COMPONENTS ---

const SectionHeading = ({ title, subtitle, centered = true, dark = true }) => (
  <div className={`mb-20 ${centered ? 'text-center' : 'text-left'}`}>
    {subtitle && <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-sm uppercase tracking-[0.3em] font-bold mb-4">{subtitle}</p>}
    <h2 className={`text-fluid-h2 font-serif tracking-tight font-light ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    <div className={`w-24 h-px mt-8 ${centered ? 'mx-auto' : ''} bg-gradient-to-r from-[#ea580c] to-transparent`}></div>
  </div>
);

// 1. Hero Section (Premium 3D Showcase / Centered Fallback)
const HeroSection = ({ config }) => {
  if (!config) {
    return (
      <section className="relative w-full h-[320px] md:h-[400px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center text-center px-6 z-10 pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ea580c]/5 to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] text-[#ea580c] uppercase font-bold mb-4">PORTFOLIO</span>
          <h1 className="text-fluid-hero font-serif text-white tracking-tight uppercase mb-4 leading-none">
            OUR WORK
          </h1>
          <div className="w-16 h-px bg-[#ea580c] mb-6"></div>
          <p className="text-sm md:text-base text-zinc-400 font-light tracking-wide max-w-xl">
            Showcasing timeless stories through photography and film.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[500px] md:h-[550px] lg:h-[600px] bg-[#0a0a0a] overflow-hidden flex items-center pt-16 md:pt-20">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      {/* Layer 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config.backgroundImage} 
          alt="Portfolio Background" 
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        {/* Layer 2: Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55))'
          }}
        ></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between h-full pt-12 md:pt-6">
        {/* Left Column: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left text-white mt-8 md:mt-0 z-10">
          <span className="text-[10px] tracking-[0.25em] text-[#ea580c] uppercase font-bold mb-3">Portfolio</span>
          <h1 className="text-fluid-hero font-serif tracking-tight font-extralight uppercase leading-[1.1] mb-4">
            {config.title || 'OUR WORK'}
          </h1>
          <div className="w-16 h-0.5 bg-[#ea580c] mb-5"></div>
          <p className="text-xs sm:text-sm md:text-base font-light tracking-widest uppercase text-zinc-300 max-w-md">
            {config.subtitle || 'Crafting Stories Through Frames'}
          </p>
        </div>

        {/* Right Column: Floating Foreground Subject */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-end h-[55%] md:h-[80%] lg:h-[90%] relative mt-6 md:mt-0 z-10">
          <img
            src={config.heroImage}
            alt="Portfolio Subject"
            loading="lazy"
            className="max-h-full max-w-full object-contain animate-float"
            style={{
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      </div>
    </section>
  );
};

// 2. About The Artist
const AboutSection = ({ config }) => {
  if (!config) return null;
  return (
  <section className="py-40 bg-[#0a0a0a] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">
      <div className="w-full lg:w-5/12 relative group">
        <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl relative border-t border-x border-white/10">
          <img src="https://images.unsplash.com/photo-1554046920-90dcac824bd1?auto=format&fit=crop&q=80&w=1000" alt="The Artist" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>
        <div className="absolute -bottom-8 -right-8 bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-full shadow-2xl w-40 h-40 flex flex-col items-center justify-center group-hover:border-[#ea580c]/50 transition-colors duration-700">
          <p className="text-4xl font-serif text-white mb-1">{config.yearsOfExperience}+</p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 text-center leading-tight">Years<br/>Experience</p>
        </div>
      </div>
      <div className="w-full lg:w-7/12">
        <SectionHeading title={config.heading} subtitle="About The Artist" centered={false} />
        <div className="space-y-8 text-gray-300 font-light text-lg md:text-xl leading-relaxed">
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-[#ea580c] first-letter:mr-3 first-letter:float-left">
            {config.fullDescription}
          </p>
        </div>
        <div className="mt-12 flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 opacity-40 invert mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
)};

// 3. Achievements & Statistics
const StatsSection = ({ config }) => {
  if (!config) return null;
  const dynamicStats = [
    { label: "Projects Completed", value: `${config.projectsCompleted}+`, icon: <Heart className="w-8 h-8 text-[#ea580c] mb-4" /> },
    { label: "Happy Clients", value: `${config.happyClients}+`, icon: <Star className="w-8 h-8 text-[#ea580c] mb-4" /> },
    { label: "Team Size", value: `${config.teamSize}`, icon: <ShieldCheck className="w-8 h-8 text-[#ea580c] mb-4" /> },
    { label: "Years of Experience", value: `${config.yearsOfExperience}`, icon: <Camera className="w-8 h-8 text-[#ea580c] mb-4" /> }
  ];
  return (
  <section className="py-24 bg-[#0d0d0d] relative z-20 border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 text-center">
        {dynamicStats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-serif text-white mb-2 font-light tracking-tight">{stat.value}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)};
// 4. Premium Gallery (Masonry)
const PremiumGallerySection = ({ collections }) => {
  if (!collections || collections.length === 0) return null;
  return (
  <section className="py-40 bg-[#0a0a0a] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20">
        <SectionHeading title="Visual Aesthetic" subtitle="Collections Gallery" centered={false} />
        <button className="text-white hover:text-[#ea580c] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center transition-colors pb-8">
          Explore Categories <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      
      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
        {collections.map((item, idx) => (
          <div key={idx} className="break-inside-avoid mb-8 relative group rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/5">
            <div className={`w-full relative overflow-hidden aspect-[4/5]`}>
              <img src={item.coverImage || item.images?.[0]} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <span className="text-white font-serif text-3xl font-light tracking-tight">{item.title}</span>
                <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                <div className="w-0 h-px bg-[#ea580c] mt-4 group-hover:w-12 transition-all duration-700 ease-out"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)};

// 5. Awards & Recognition
const AwardsSection = ({ achievements }) => {
  if (!achievements || achievements.length === 0) return null;
  return (
  <section className="py-40 bg-[#0a0a0a] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
      <SectionHeading title="Awards & Recognition" subtitle="Excellence Proven" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center justify-center transition-all duration-1000 mt-20">
        {achievements.map(ach => (
          <div key={ach._id} className="flex flex-col items-center group">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#ea580c] group-hover:bg-[#ea580c]/5 transition-colors duration-700 overflow-hidden">
                {ach.awardImage ? (
                  <img src={ach.awardImage} alt={ach.awardName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-white group-hover:text-[#ea580c] transition-colors duration-700" />
                )}
             </div>
             <p className="text-[#ea580c] text-sm font-bold tracking-widest mb-2">{ach.awardYear}</p>
             <p className="text-white font-serif text-xl font-light tracking-wide text-center">{ach.awardName}</p>
             <p className="text-zinc-500 text-sm mt-2">{ach.awardOrganization}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const data = await getPortfolio();
        setPortfolio(data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans w-full relative selection:bg-[#ea580c] selection:text-white">
      {loading ? (
        <div className="w-full h-[500px] bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
        </div>
      ) : (
        <>
          <HeroSection config={portfolio?.heroSection} />
          <AboutSection config={portfolio?.descriptionSection} />
          <StatsSection config={portfolio?.descriptionSection} />
          <AwardsSection achievements={portfolio?.achievements} />
          <PremiumGallerySection collections={portfolio?.collections} />
        </>
      )}

    </div>
  );
}
