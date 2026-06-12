import React, { useState, useEffect } from 'react';
import { Play, Film, Smartphone, Camera, Image as ImageIcon, Check, Star, ChevronDown, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIntent } from '../context/IntentContext';
import { getFilmCategories, getAllFilms, getReels } from '../api/filmService';
import PremiumVideoModal from '../components/shared/PremiumVideoModal';
import useSEO from '../hooks/useSEO';

// --- COMPONENTS ---

const HeroSection = () => {
  const { executeProtectedAction } = useIntent();
  return (
    <section className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920" alt="Cinematic Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <span className="text-[#ea580c] uppercase tracking-[0.3em] text-xs font-bold mb-6">Explore Our Portfolio</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
          Crafting Timeless <br /><span className="italic text-[#ea580c]">Wedding Stories</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-light tracking-wide">
          Every glance, every smile, every emotion beautifully captured and transformed into a cinematic masterpiece.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <button onClick={() => document.getElementById('featured-films').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-10 py-4 rounded-sm hover:bg-gray-200 transition-all duration-300 tracking-widest text-xs font-bold uppercase shadow-xl">
            View Films
          </button>
          <button onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW')} className="border border-white/40 text-white backdrop-blur-sm px-10 py-4 rounded-sm hover:bg-white/10 transition-all duration-300 tracking-widest text-xs font-bold uppercase">
            Book Your Date
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="text-white/70 w-8 h-8 cursor-pointer" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })} />
      </div>
    </section>
  );
};

const CategoriesSection = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="py-20 bg-black text-white relative z-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">Film Categories</h2>
          <p className="text-gray-400 text-lg">Select a category to explore our diverse storytelling portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/films/${cat.slug}`} className="group relative rounded-xl overflow-hidden aspect-video cursor-pointer shadow-lg">
              <img src={cat.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <h3 className="text-2xl font-serif text-white group-hover:text-[#ea580c] transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedFilmsSection = ({ films, onVideoClick }) => {
  const featuredFilms = films.filter(f => f.featured).slice(0, 6);

  if (featuredFilms.length === 0) return null;

  return (
    <section id="featured-films" className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100 overflow-hidden">
      <div className="max-w-[100vw] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Our Signature Wedding Films</h2>
          <p className="text-gray-600 text-lg">A collection of unforgettable love stories captured through our lens.</p>
        </div>

        {/* Horizontal Marquee */}
        <div className="flex gap-8 overflow-x-auto pb-10 hide-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory">
          {featuredFilms.map((film, idx) => (
            <div key={idx} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] group relative rounded-xl overflow-hidden cursor-pointer snap-center shadow-xl hover:shadow-2xl transition-all duration-500" onClick={() => onVideoClick(film)}>
              <div className="aspect-[16/9] w-full relative overflow-hidden rounded-xl bg-black">
                {film.thumbnailType === 'video' && film.thumbnailVideo ? (
                  <video src={film.thumbnailVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <img src={film.thumbnail || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"} alt={film.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>

                {/* Duration Badge */}
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                  {film.category} • {film.duration || 'Feature'}
                </span>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-all duration-300">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center">
                <h3 className="text-2xl font-serif text-gray-900 group-hover:text-[#ea580c] transition-colors line-clamp-1">{film.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{film.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReelsSection = ({ reels, onReelClick }) => {
  if (!reels || reels.length === 0) return null;
  const trendingReels = reels.filter(r => r.trending).slice(0, 10);
  if (trendingReels.length === 0) trendingReels.push(...reels.slice(0, 10));

  return (
    <section className="py-20 bg-white overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight">Social Highlights</h2>
        <p className="text-gray-600 text-lg mt-4">Trending reels and short cinematic moments.</p>
      </div>

      <div className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-8 hide-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory">
        {trendingReels.map((reel, idx) => (
          <div 
            key={idx} 
            onClick={() => onReelClick(reel)}
            className="shrink-0 w-[240px] md:w-[280px] aspect-[9/16] relative rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 snap-center bg-gradient-to-br from-purple-600 via-pink-500 to-[#ea580c]"
          >
            {reel.thumbnail ? (
              <img src={reel.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={reel.title} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-80 mix-blend-overlay">
                <Smartphone className="w-16 h-16 text-white/50 mb-4" />
                <span className="text-white/50 text-xs tracking-widest font-bold uppercase">Instagram Reel</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>

            {reel.trending && (
              <span className="absolute top-4 left-4 bg-[#ea580c] text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase shadow-md">
                Trending
              </span>
            )}
            <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest shadow-md">
              {reel.duration}
            </span>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-[#ea580c] group-hover:border-[#ea580c] group-hover:scale-110 transition-all">
                <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-bold text-sm line-clamp-2 mb-2 drop-shadow-md">{reel.title}</h4>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-white/90" />
                <span className="text-white/90 text-[10px] uppercase font-bold tracking-widest drop-shadow-sm">{reel.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DeliverablesSection = () => (
  <section className="py-24 bg-white relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">What's Included In Your Experience</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Film, title: "Wedding Film", desc: "15–30 minute cinematic wedding movie professionally edited with storytelling techniques." },
          { icon: Play, title: "Wedding Teaser", desc: "60–90 second emotional teaser perfect for sharing with family and friends." },
          { icon: Smartphone, title: "Instagram Reels", desc: "Short-form vertical videos optimized for Instagram and social media." },
          { icon: Plus, title: "Drone Coverage", desc: "Aerial cinematic footage capturing venue beauty and grand wedding moments." },
          { icon: Camera, title: "Edited Photos", desc: "Professionally edited high-resolution images." },
          { icon: ImageIcon, title: "Online Gallery", desc: "Private gallery for easy viewing and sharing." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <item.icon className="w-10 h-10 text-[#ea580c] mb-6" />
            <h3 className="text-xl font-serif text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ComparisonSection = () => (
  <section className="py-24 bg-[#f8fafc] relative z-20 border-t border-gray-100">
    <div className="max-w-5xl mx-auto px-6 md:px-12 overflow-x-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Package Comparison</h2>
      </div>
      <table className="w-full text-left border-collapse min-w-[800px] bg-white rounded-xl shadow-sm overflow-hidden">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="py-6 px-6 text-gray-500 font-bold uppercase tracking-widest text-xs w-1/4">Features</th>
            <th className="py-6 px-6 text-gray-900 font-serif text-xl w-1/4 text-center">Silver</th>
            <th className="py-6 px-6 text-[#ea580c] font-serif text-2xl w-1/4 text-center relative bg-orange-50/30">
              Gold
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-md">Popular</div>
            </th>
            <th className="py-6 px-6 text-gray-900 font-serif text-xl w-1/4 text-center">Platinum</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {[
            { feature: "Edited Photos", s: "200+", g: "400+", p: "Unlimited" },
            { feature: "Wedding Film", s: "3-5 Min", g: "15-20 Min", p: "20-40 Min" },
            { feature: "Wedding Teaser", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500" />, p: <Check className="w-5 h-5 mx-auto text-green-500" /> },
            { feature: "Instagram Reels", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500" />, p: <Check className="w-5 h-5 mx-auto text-green-500" /> },
            { feature: "Drone Coverage", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500" />, p: <Check className="w-5 h-5 mx-auto text-green-500" /> },
            { feature: "Premium Album", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500" />, p: "Luxury Album" },
          ].map((row, idx) => (
            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-5 px-6 text-gray-700 font-medium">{row.feature}</td>
              <td className="py-5 px-6 text-gray-600 text-center">{row.s}</td>
              <td className="py-5 px-6 text-gray-900 text-center font-semibold bg-orange-50/20">{row.g}</td>
              <td className="py-5 px-6 text-gray-600 text-center">{row.p}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const TestimonialsSection = () => {
  const reviews = [
    { name: "Aisha & Rohan", location: "Udaipur", rating: 5, text: "The cinematic film they created for us brought tears to everyone's eyes. It perfectly captured the essence of our 3-day wedding." },
    { name: "Priya & Siddharth", location: "Goa", rating: 5, text: "Absolutely phenomenal! The drone shots and the storytelling were beyond our expectations. A truly premium experience." },
    { name: "Meera & Arjun", location: "Jaipur", rating: 5, text: "They made us feel so comfortable in front of the camera, and the final reel was exactly what we wanted to share on Instagram." }
  ];
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-16 text-center">Love Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ea580c] text-[#ea580c]" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-8 leading-relaxed text-sm">"{review.text}"</p>
              </div>
              <div>
                <h4 className="text-gray-900 font-serif text-lg">{review.name}</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqSection = () => {
  const faqs = [
    { q: "How far in advance should I book?", a: "We recommend booking 6-12 months in advance, especially for popular wedding dates." },
    { q: "Do you travel for destination weddings?", a: "Yes, we travel worldwide. Destination packages include travel and accommodation coordination." },
    { q: "How long does delivery take?", a: "Teasers are delivered within 1 week. Full films take 8-12 weeks depending on the season." },
    { q: "Can I customize a package?", a: "Absolutely. All our packages serve as a baseline. We can tailor any service to your exact needs." }
  ];
  return (
    <section className="py-24 bg-[#f8fafc] relative z-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-white border border-gray-200 rounded-lg open:shadow-sm transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-serif text-lg list-none text-gray-900">
                {faq.q}
                <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-[#ea580c]" />
              </summary>
              <div className="p-6 pt-0 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  const { executeProtectedAction } = useIntent();
  return (
    <section className="relative py-32 bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200" alt="Cinematic" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>
      </div>
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Ready To Create Your Wedding Story?</h2>
        <p className="text-white/80 text-lg mb-10 font-light">Your wedding date is one of the most important days of your life. Let us capture it beautifully.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-transparent border border-white text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors backdrop-blur-sm">Check Availability</button>
          <button onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW')} className="bg-[#ea580c] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#c2410c] transition-colors border border-[#ea580c] shadow-xl">Book Now</button>
        </div>
      </div>
    </section>
  );
};

const PackagesSection = ({ onSelectPackage }) => {
  const { executeProtectedAction } = useIntent();
  const packages = [
    { name: "Essential Wedding Package", features: ["Wedding Film", "Wedding Teaser", "200 Edited Photos", "Online Gallery"] },
    { name: "Premium Wedding Package", features: ["Wedding Film", "Wedding Teaser", "Instagram Reels", "Drone Coverage", "Premium Album"] }
  ];
  return (
    <section className="py-24 bg-white relative z-20" id="packages">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-16 text-center">Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-serif text-gray-900 mb-8 pb-6 border-b border-gray-100">{pkg.name}</h3>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-bold">Includes:</p>
              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700 space-x-3 text-sm font-medium">
                    <Check className="w-4 h-4 text-[#ea580c]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW', { category: "Wedding Filming", name: pkg.name, features: pkg.features })}
                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-[#ea580c] transition-colors shadow-md"
              >
                Enquire Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WeddingFilmsPage() {
  useSEO();
  const [categories, setCategories] = useState([]);
  const [films, setFilms] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      setLoading(true);
      const [catsData, filmsData, reelsData] = await Promise.all([
        getFilmCategories(),
        getAllFilms(),
        getReels()
      ]);
      setCategories(catsData || []);
      setFilms(filmsData || []);
      setReels(reelsData || []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans text-gray-900">
        <div className="w-16 h-16 border-4 border-[#ea580c]/20 border-t-[#ea580c] rounded-full animate-spin mb-4"></div>
        <p className="text-sm uppercase tracking-widest font-bold text-gray-500">Loading Cinema...</p>
      </div>
    );
  }

  // If no content is published yet, show a premium Coming Soon state
  if (categories.length === 0 && films.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
        <Film className="w-16 h-16 text-[#ea580c] mb-6" />
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-4">Cinematic Portfolio</h1>
        <p className="text-gray-400 text-lg text-center max-w-lg mb-8">We are curating our latest masterworks. Our cinematic gallery will be available soon.</p>
        <Link to="/" className="border border-white/20 hover:bg-white/10 px-8 py-3 uppercase tracking-widest text-xs font-bold transition-all rounded-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedFilmsSection films={films} onVideoClick={setActiveVideo} />
      <ReelsSection reels={reels} onReelClick={setActiveVideo} />
      <DeliverablesSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <PackagesSection />

      {/* Global Video Modal */}
      <PremiumVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
