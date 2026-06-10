import React, { useState } from 'react';
import { Play, Film, Smartphone, Camera, Image as ImageIcon, Check, Star, ChevronDown, Plus, X } from 'lucide-react';
import BookingModal from '../components/BookingModal';

// --- DATA ---
const FEATURED_FILMS = [
  { couple: "Aisha & Rohan", location: "Udaipur Palace", duration: "24:15", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { couple: "Priya & Siddharth", location: "Goa Beach Resort", duration: "18:30", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" },
  { couple: "Meera & Arjun", location: "Jaipur Heritage", duration: "32:10", thumb: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800" },
];

const REELS = [
  { thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400", duration: "0:45", trending: true },
  { thumb: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=400", duration: "0:59", trending: false },
  { thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400", duration: "0:30", trending: true },
  { thumb: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400", duration: "1:00", trending: false },
  { thumb: "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=400", duration: "0:45", trending: false },
];

const CATEGORIES = ["All", "Wedding Films", "Pre-Wedding Films", "Wedding Reels", "Couple Stories", "Drone Cinematics"];

// --- COMPONENTS ---

const HeroSection = () => (
  <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="https://cdn.coverr.co/videos/coverr-temp-dfwgwipes-mov-3172/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-16">
      <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
        Crafting Timeless <br/><span className="italic text-[#ea580c]">Wedding Stories</span>
      </h1>
      <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-light tracking-wide">
        Every glance, every smile, every emotion beautifully captured and transformed into a cinematic masterpiece.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button className="bg-white text-black px-10 py-4 rounded-sm hover:bg-gray-200 transition-all duration-300 tracking-widest text-xs font-bold uppercase shadow-xl">
          View Films
        </button>
        <button className="border border-white/40 text-white backdrop-blur-sm px-10 py-4 rounded-sm hover:bg-white/10 transition-all duration-300 tracking-widest text-xs font-bold uppercase">
          Book Your Date
        </button>
      </div>
    </div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <ChevronDown className="text-white/70 w-8 h-8" />
    </div>
  </section>
);

const FeaturedFilmsSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Our Signature Wedding Films</h2>
          <p className="text-gray-600 text-lg">A collection of unforgettable love stories captured through our lens.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_FILMS.map((film, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden cursor-pointer" onClick={() => setActiveVideo(film)}>
              <div className="aspect-[16/9] w-full relative overflow-hidden rounded-xl shadow-lg">
                <img src={film.thumb} alt={film.couple} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                
                {/* Duration Badge */}
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest">
                  {film.duration}
                </span>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-all duration-300">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="pt-5 text-center">
                <h3 className="text-xl font-serif text-gray-900 group-hover:text-[#ea580c] transition-colors">{film.couple}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">{film.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white/50 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-5xl aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl relative">
            <video autoPlay controls className="w-full h-full">
               <source src="https://cdn.coverr.co/videos/coverr-temp-dfwgwipes-mov-3172/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

const ReelsSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
        <h2 className="text-2xl md:text-4xl font-serif text-gray-900 tracking-tight">Wedding Reels & Social Highlights</h2>
      </div>
      
      <div className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-8 hide-scrollbar cursor-grab active:cursor-grabbing">
        {REELS.map((reel, idx) => (
          <div key={idx} className="shrink-0 w-[240px] md:w-[280px] aspect-[9/16] relative rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
            <img src={reel.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
            
            {reel.trending && (
              <span className="absolute top-4 left-4 bg-[#ea580c] text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                Trending
              </span>
            )}
            <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest">
              {reel.duration}
            </span>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-white/90" />
                <span className="text-white text-xs font-semibold tracking-wide shadow-sm">Instagram Reel</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoriesSection = () => {
  const [activeCat, setActiveCat] = useState("All");

  return (
    <section className="py-16 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCat(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all ${activeCat === cat ? 'bg-[#ea580c] text-white border-transparent shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm'}`}
          >
            {cat}
          </button>
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
            { feature: "Wedding Teaser", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500"/>, p: <Check className="w-5 h-5 mx-auto text-green-500"/> },
            { feature: "Instagram Reels", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500"/>, p: <Check className="w-5 h-5 mx-auto text-green-500"/> },
            { feature: "Drone Coverage", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500"/>, p: <Check className="w-5 h-5 mx-auto text-green-500"/> },
            { feature: "Premium Album", s: "-", g: <Check className="w-5 h-5 mx-auto text-green-500"/>, p: "Luxury Album" },
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

const CtaSection = () => (
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
        <button className="bg-[#ea580c] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#c2410c] transition-colors border border-[#ea580c] shadow-xl">Book Now</button>
      </div>
    </div>
  </section>
);

const PackagesSection = ({ onSelectPackage }) => {
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
                onClick={() => onSelectPackage({ category: "Wedding Filming", name: pkg.name, features: pkg.features })}
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
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900">
      <HeroSection />
      <FeaturedFilmsSection />
      <ReelsSection />
      <CategoriesSection />
      <DeliverablesSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <PackagesSection onSelectPackage={setSelectedPackage} />
      
      <BookingModal 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
        packageData={selectedPackage} 
      />
    </div>
  );
}
