import React, { useState } from 'react';
import { Play, Camera, Star, Award, ChevronRight, Video, FileImage, ShieldCheck, MapPin, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// --- DATA ---
const STATS = [
  { label: "Weddings Captured", value: "100+", icon: <Heart className="w-8 h-8 text-[#ea580c] mb-4" /> },
  { label: "Instagram Community", value: "10K+", icon: <InstagramIcon className="w-8 h-8 text-[#ea580c] mb-4" /> },
  { label: "Photos Delivered", value: "50K+", icon: <FileImage className="w-8 h-8 text-[#ea580c] mb-4" /> },
  { label: "Films Produced", value: "300+", icon: <Video className="w-8 h-8 text-[#ea580c] mb-4" /> },
  { label: "Creator Awards Won", value: "12", icon: <Award className="w-8 h-8 text-[#ea580c] mb-4" /> },
  { label: "Years of Experience", value: "8", icon: <Camera className="w-8 h-8 text-[#ea580c] mb-4" /> },
];

const FEATURED_WORK = [
  { id: 1, title: "A Royal Affair", type: "Wedding Story", location: "Udaipur Palace", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", span: "col-span-1 md:col-span-2 row-span-2" },
  { id: 2, title: "Sunset Vows", type: "Destination Shoot", location: "Maldives", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800", span: "col-span-1" },
  { id: 3, title: "Corporate Gala", type: "Corporate Event", location: "Mumbai", image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", span: "col-span-1" },
  { id: 4, title: "Cinematic Horizons", type: "Drone Cinematics", location: "Kerala Backwaters", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200", span: "col-span-1 md:col-span-2" }
];

const WEDDING_STORIES = [
  {
    couple: "Rahul & Priya",
    location: "Jaipur, Rajasthan",
    date: "November 2025",
    cover: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200",
    snippet: "A breathtaking 3-day royal wedding celebration capturing raw emotion, rich traditions, and an unforgettable Sangeet night under the stars."
  }
];

const PREMIUM_GALLERY = [
  { category: "Wedding", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[3/4]" },
  { category: "Pre-Wedding", image: "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[4/5]" },
  { category: "Portrait", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[2/3]" },
  { category: "Couple", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", aspect: "aspect-square" },
  { category: "Event", image: "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[3/4]" },
  { category: "Editorial", image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[4/3]" }
];

const FILMS = [
  { id: 1, title: "The Ultimate Celebration", duration: "12:45", category: "Wedding Film", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Mountain Top Romance", duration: "04:30", category: "Pre-Wedding", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Into the Clouds", duration: "02:15", category: "Drone Video", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
];

const INSTAGRAM_POSTS = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&q=80&w=400"
];

const BEHIND_SCENES = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512403754473-27835f7b9984?auto=format&fit=crop&q=80&w=800",
];

const CREATIVE_PROCESS = [
  { step: "01", title: "Consultation", desc: "Understanding your vision, style, and requirements in a deep collaborative session." },
  { step: "02", title: "Planning", desc: "Scouting locations, finalizing timelines, lighting setups, and storyboarding the narrative." },
  { step: "03", title: "Shoot Day", desc: "Executing the vision flawlessly with unobtrusive, state-of-the-art cinema equipment." },
  { step: "04", title: "Editing", desc: "Professional color grading, sound design, and cinematic video editing." },
  { step: "05", title: "Album Design", desc: "Crafting a bespoke luxury album layout that feels like a timeless heirloom." },
  { step: "06", title: "Delivery", desc: "Presenting the final masterpiece in a premium, personalized package." },
];

const TRUSTED_BY = ["Taj Hotels", "The Leela", "Oberoi Resorts", "Marriott", "Vogue Weddings", "Sony Imaging"];

// --- COMPONENTS ---

const SectionHeading = ({ title, subtitle, centered = true, dark = true }) => (
  <div className={`mb-20 ${centered ? 'text-center' : 'text-left'}`}>
    {subtitle && <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-sm uppercase tracking-[0.3em] font-bold mb-4">{subtitle}</p>}
    <h2 className={`text-4xl md:text-6xl font-serif tracking-tight font-light ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    <div className={`w-24 h-px mt-8 ${centered ? 'mx-auto' : ''} bg-gradient-to-r from-[#ea580c] to-transparent`}></div>
  </div>
);

// 1. Hero Section
const HeroSection = () => (
  <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="https://cdn.coverr.co/videos/coverr-temp-dfwgwipes-mov-3172/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">
      <span className="text-white border border-white/20 px-6 py-2 rounded-full font-medium tracking-[0.2em] text-[10px] uppercase mb-8 backdrop-blur-md">Premium Studio</span>
      <h1 className="text-6xl md:text-8xl lg:text-[100px] font-serif text-white mb-6 tracking-tighter leading-[0.9] drop-shadow-2xl">
        Timeless <br/><span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-400">Masterpieces</span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl font-light tracking-wide leading-relaxed">
        Award-winning photography & cinematography capturing raw emotion, authentic moments, and true luxury.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
        <button className="bg-white text-black px-12 py-5 rounded-full hover:bg-gray-200 transition-all duration-300 tracking-[0.15em] text-xs font-bold uppercase shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          Explore Portfolio
        </button>
        <button className="bg-black/40 border border-white/30 text-white backdrop-blur-md px-12 py-5 rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-[0.15em] text-xs font-bold uppercase">
          Book Consultation
        </button>
      </div>
    </div>
    <div className="absolute bottom-10 animate-bounce text-white/50">
      <ChevronDown className="w-8 h-8 font-light" />
    </div>
  </section>
);

// 2. About The Artist
const AboutSection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">
      <div className="w-full lg:w-5/12 relative group">
        <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl relative border-t border-x border-white/10">
          <img src="https://images.unsplash.com/photo-1554046920-90dcac824bd1?auto=format&fit=crop&q=80&w=1000" alt="The Artist" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>
        <div className="absolute -bottom-8 -right-8 bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-full shadow-2xl w-40 h-40 flex flex-col items-center justify-center group-hover:border-[#ea580c]/50 transition-colors duration-700">
          <p className="text-4xl font-serif text-white mb-1">8+</p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 text-center leading-tight">Years<br/>Experience</p>
        </div>
      </div>
      <div className="w-full lg:w-7/12">
        <SectionHeading title="Vision. Passion. Legacy." subtitle="About The Artist" centered={false} />
        <div className="space-y-8 text-gray-300 font-light text-lg md:text-xl leading-relaxed">
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-[#ea580c] first-letter:mr-3 first-letter:float-left">
            My journey into photography began with a profound desire to freeze time. Over the years, I have specialized exclusively in luxury weddings, breathtaking destination shoots, and grand corporate events.
          </p>
          <p>
            I don't just take pictures; I document legacies. From the quiet, nervous moments before the ceremony to the explosive joy of the reception, my approach is unobtrusive, cinematic, and deeply emotional.
          </p>
          <p className="text-gray-400 italic font-serif">
            "Equipped with state-of-the-art cinema cameras, I ensure that your memories are preserved in the absolute highest quality possible."
          </p>
        </div>
        <div className="mt-12 flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 opacity-40 invert mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
);

// 3. Achievements & Statistics
const StatsSection = () => (
  <section className="py-24 bg-[#0d0d0d] relative z-20 border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-16 text-center">
        {STATS.map((stat, idx) => (
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
);

// 4. Featured Work (Bento Grid)
const FeaturedWorkSection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <SectionHeading title="Selected Masterpieces" subtitle="Curated Best Work" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[800px]">
        {FEATURED_WORK.map((work) => (
          <div key={work.id} className={`group relative rounded-3xl overflow-hidden cursor-pointer ${work.span} h-[400px] md:h-auto border border-white/10 shadow-2xl`}>
            <img src={work.image} alt={work.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Elegant Content Frame */}
            <div className="absolute inset-6 border border-white/10 rounded-2xl p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 group-hover:border-white/20 transition-all duration-700">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-3 block">{work.type}</span>
              <h3 className="text-4xl font-serif text-white mb-3 font-light tracking-tight">{work.title}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-6 font-light tracking-wide">
                <MapPin className="w-4 h-4 mr-2" /> {work.location}
              </div>
              <div className="overflow-hidden">
                <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-white text-xs uppercase tracking-[0.2em] flex items-center border-b border-white/30 pb-1 hover:border-[#ea580c] hover:text-[#ea580c]">
                  View Story <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. Wedding Stories
const WeddingStoriesSection = () => (
  <section className="py-40 bg-[#0f0f0f] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <SectionHeading title="Real Love Stories" subtitle="Narrative Features" />
      
      {WEDDING_STORIES.map((story, idx) => (
        <div key={idx} className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 flex flex-col lg:flex-row group">
          <div className="w-full lg:w-1/2 h-[500px] lg:h-auto relative overflow-hidden">
             <img src={story.cover} alt={story.couple} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
             <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Frosted Glass Content Panel */}
          <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center relative bg-black/40 backdrop-blur-3xl">
            <div className="absolute top-0 right-0 p-8 text-[#ea580c]/20 font-serif text-8xl md:text-[150px] leading-none select-none">"</div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 block relative z-10">Featured Wedding</span>
            <h3 className="text-5xl md:text-7xl font-serif text-white mb-6 font-light tracking-tighter relative z-10">{story.couple}</h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mb-10 relative z-10 flex items-center">
              <MapPin className="w-3 h-3 mr-2" /> {story.location} <span className="mx-4">|</span> {story.date}
            </p>
            <p className="text-gray-300 font-light text-lg leading-relaxed mb-12 relative z-10">
              {story.snippet}
            </p>
            <button className="w-max bg-white text-black px-10 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 tracking-[0.2em] text-[10px] font-bold uppercase shadow-xl relative z-10">
              View Full Gallery
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// 6. Premium Gallery (Masonry)
const PremiumGallerySection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20">
        <SectionHeading title="Visual Aesthetic" subtitle="Portfolio" centered={false} />
        <button className="text-white hover:text-[#ea580c] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center transition-colors pb-8">
          Explore Categories <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      
      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
        {PREMIUM_GALLERY.map((item, idx) => (
          <div key={idx} className="break-inside-avoid mb-8 relative group rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/5">
            <div className={`${item.aspect} w-full relative overflow-hidden`}>
              <img src={item.image} alt={item.category} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <span className="text-white font-serif text-3xl font-light tracking-tight">{item.category}</span>
                <div className="w-0 h-px bg-[#ea580c] mt-4 group-hover:w-12 transition-all duration-700 ease-out"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 7. Cinematic Film Showcase
const CinematicFilmSection = () => (
  <section className="py-40 bg-[#050505] relative z-20 overflow-hidden border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
      <SectionHeading title="Cinematic Films" subtitle="Motion & Storytelling" />
    </div>
    
    <div className="flex overflow-x-auto gap-10 px-6 md:px-12 pb-16 hide-scrollbar cursor-grab active:cursor-grabbing">
      {FILMS.map((vid) => (
        <div key={vid.id} className="shrink-0 w-[85vw] sm:w-[600px] md:w-[700px] flex flex-col group cursor-pointer">
          <div className="w-full aspect-[21/9] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8">
            <img src={vid.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100 grayscale hover:grayscale-0" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:border-white transition-all duration-500">
                <Play className="w-8 h-8 text-white group-hover:text-black ml-2" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md text-white text-[10px] tracking-[0.2em] font-bold px-4 py-2 rounded-full border border-white/10">
              {vid.duration}
            </div>
          </div>
          <div className="text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-3 block">{vid.category}</span>
            <h3 className="text-4xl font-serif text-white font-light tracking-tight">{vid.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// 8. Awards & Recognition
const AwardsSection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
      <SectionHeading title="Awards & Recognition" subtitle="Excellence Proven" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 mt-20">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex flex-col items-center group">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#ea580c] group-hover:bg-[#ea580c]/5 transition-colors duration-700">
                <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-white group-hover:text-[#ea580c] transition-colors duration-700" />
             </div>
             <p className="text-white font-serif text-xl font-light tracking-wide text-center">Global Wedding<br/>Awards 202{i}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 9. Instagram Presence
const InstagramSection = () => (
  <section className="py-40 bg-[#0d0d0d] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-col items-center text-center mb-20">
        <InstagramIcon className="w-12 h-12 text-[#ea580c] mb-6" />
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight font-light mb-6">Join The Community</h2>
        <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide mb-10 max-w-2xl">Follow along for daily inspiration, behind the scenes, and latest work.</p>
        <button className="border border-white/20 bg-white/5 backdrop-blur-md text-white px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-[0.2em] text-[10px] font-bold uppercase">
          Follow @BookMyWed
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {INSTAGRAM_POSTS.map((post, idx) => (
          <div key={idx} className="aspect-square relative group overflow-hidden cursor-pointer rounded-2xl bg-white/5">
            <img src={post} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-50 group-hover:scale-100">
               <Heart className="w-8 h-8 text-white fill-current drop-shadow-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 10. Testimonials
const TestimonialSection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20 border-t border-white/5 overflow-hidden">
    <div className="max-w-6xl mx-auto px-6 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ea580c]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <SectionHeading title="Words of Love" subtitle="Client Experiences" />
      
      <div className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 p-12 md:p-24 rounded-[3rem] relative mt-20 shadow-2xl">
        <div className="flex justify-center text-amber-400 mb-10 space-x-3">
           {[...Array(5)].map((_,i) => <Star key={i} className="w-6 h-6 fill-current" />)}
        </div>
        <p className="text-2xl md:text-4xl font-serif text-white mb-16 leading-relaxed italic font-light tracking-wide">
          "Booking them was the best decision of our wedding. The team was practically invisible, yet they captured every single tear, laugh, and chaotic moment perfectly. The final film looked like a Hollywood movie."
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 mb-6 shadow-xl">
             <img src="https://i.pravatar.cc/150?img=47" className="w-full h-full object-cover" />
          </div>
          <p className="text-white font-serif text-2xl tracking-wide mb-2">Sarah & Michael</p>
          <p className="text-[#ea580c] text-[10px] uppercase tracking-[0.3em] font-bold">Lake Como Destination Wedding</p>
        </div>
      </div>
    </div>
  </section>
);

// 11. Behind The Scenes
const BehindScenesSection = () => (
  <section className="py-40 bg-[#0d0d0d] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <SectionHeading title="Behind The Lens" subtitle="How The Magic Happens" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        {BEHIND_SCENES.map((img, idx) => (
          <div key={idx} className={`aspect-[4/5] relative rounded-3xl overflow-hidden group border border-white/5 ${idx === 1 ? 'md:-translate-y-12' : ''}`}>
            <img src={img} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-[#ea580c]/0 group-hover:bg-[#ea580c]/10 mix-blend-overlay transition-colors duration-1000"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 12. Creative Process
const ProcessSection = () => (
  <section className="py-40 bg-[#0a0a0a] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <SectionHeading title="The Creative Process" subtitle="From Vision to Reality" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-24">
        {CREATIVE_PROCESS.map((p) => (
          <div key={p.step} className="relative p-10 border border-white/5 rounded-[2rem] bg-[#111] hover:bg-white/5 transition-colors duration-500 group">
            <span className="absolute -top-8 left-8 text-[80px] font-serif font-light text-white/5 group-hover:text-white/10 transition-colors duration-500">{p.step}</span>
            <div className="relative z-10 pt-4">
              <h3 className="text-3xl font-serif text-white mb-6 font-light tracking-tight">{p.title}</h3>
              <p className="text-gray-400 font-light text-lg leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 13. Trusted By
const TrustedBySection = () => (
  <section className="py-32 bg-[#050505] relative z-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-16">Trusted By Elite Brands</p>
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        {TRUSTED_BY.map((brand, idx) => (
          <h4 key={idx} className="text-3xl font-serif text-white font-light tracking-widest">{brand}</h4>
        ))}
      </div>
    </div>
  </section>
);

// 14. Final CTA
const FinalCtaSection = () => (
  <section className="relative py-48 bg-black flex items-center justify-center overflow-hidden border-t border-white/10">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000" alt="Cinematic Couple" className="w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black"></div>
    </div>
    <div className="relative z-10 text-center max-w-4xl px-6">
      <h2 className="text-6xl md:text-8xl font-serif text-white mb-10 leading-[1.1] font-light tracking-tighter">
        Let's Create Something <br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-amber-400 pr-4">Unforgettable</span>
      </h2>
      <p className="text-gray-400 text-xl md:text-2xl mb-16 font-light tracking-wide">Whether it's a wedding, destination shoot, event, or personal project, let's capture memories that last forever.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button className="bg-white text-black px-12 py-5 rounded-full hover:bg-gray-200 transition-all duration-300 tracking-[0.2em] text-[10px] font-bold uppercase shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          Book Consultation
        </button>
        <button className="bg-transparent border border-white/30 text-white px-12 py-5 rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-[0.2em] text-[10px] font-bold uppercase backdrop-blur-md">
          Check Availability
        </button>
      </div>
    </div>
  </section>
);

export default function PortfolioPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans w-full relative selection:bg-[#ea580c] selection:text-white">
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <FeaturedWorkSection />
      <WeddingStoriesSection />
      <PremiumGallerySection />
      <CinematicFilmSection />
      <AwardsSection />
      <InstagramSection />
      <TestimonialSection />
      <BehindScenesSection />
      <ProcessSection />
      <TrustedBySection />
      <FinalCtaSection />
    </div>
  );
}
