import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesWithPackages } from '../api/packageService';
import BookingModal from '../components/BookingModal';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CategorySection = ({ category, setSelectedPackage }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-24">
      {/* Category Banner (if available) */}
      {category.banner && (
        <div className="relative w-full h-[40vh] md:h-[50vh] mb-12 rounded-3xl overflow-hidden shadow-sm mx-4 sm:mx-6 lg:mx-8" style={{ width: 'calc(100% - 2rem)' }}>
          <img src={category.banner} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{category.name}</h2>
            <p className="text-white/80 text-lg max-w-2xl">{category.description}</p>
          </div>
          <div className="absolute top-10 right-10 z-10 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white text-sm font-bold tracking-wider">
            {category.packages.length} PACKAGES
          </div>
        </div>
      )}

      {/* Category Header (if no banner) */}
      {!category.banner && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">{category.name}</h2>
            <p className="text-gray-500 max-w-2xl text-base">{category.description}</p>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider shrink-0">
            {category.packages.length} Packages Available
          </div>
        </div>
      )}

      {/* Horizontal Scroll Controls */}
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-8 top-[35%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:text-gray-900 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-8 top-[35%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:text-gray-900 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hide webkit scrollbar via inline styles or custom css class, we'll use a style block below */}
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
          `}} />
          
          {category.packages.map((pkg) => (
            <div key={pkg.id} className="snap-start shrink-0 w-[300px] md:w-[380px] bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100/50 group">
              {/* Top Area: Hero Image & Badges */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img 
                  src={pkg.media.thumbnail} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {pkg.category}
                  </span>
                  {pkg.offer && (
                    <span className="px-3 py-1 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {pkg.offer.badgeText}
                    </span>
                  )}
                  {pkg.isPopular && (
                    <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}
                </div>
              </div>
              
              {/* Middle Area: Story & Highlights */}
              <div className="p-8 flex-grow flex flex-col relative bg-white">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-gray-900 mb-3 line-clamp-2">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{pkg.shortStory}</p>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  {pkg.features.slice(0, 3).map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#ea580c] shrink-0"></div>
                      <div>
                        <span className="block text-sm font-bold text-gray-900">{feature.title}</span>
                        <span className="block text-xs text-gray-500 mt-0.5 line-clamp-1">{feature.description}</span>
                      </div>
                    </div>
                  ))}
                  {pkg.features.length > 3 && (
                    <div className="text-sm font-medium text-gray-400 italic mt-2">
                      + {pkg.features.length - 3} more experiences
                    </div>
                  )}
                </div>

                {/* Bottom Area: Pricing & CTA */}
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4 mt-auto">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Starting Investment</span>
                    {pkg.showPricing === false ? (
                      <span className="text-2xl font-serif text-gray-900">Custom Quote</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif text-gray-900">${pkg.price}</span>
                        {pkg.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">${pkg.discountPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-2">
                    <Link 
                      to={`/packages/${pkg.slug}`}
                      className="w-full py-3.5 bg-gray-900 text-white text-center rounded-xl font-bold hover:bg-gray-800 transition-colors duration-300 shadow-md"
                    >
                      View Experience
                    </Link>
                    <button 
                      onClick={() => setSelectedPackage(pkg)}
                      className="w-full py-3.5 bg-white text-gray-900 border border-gray-200 text-center rounded-xl font-bold hover:bg-gray-50 transition-colors duration-300"
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function PackagesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesWithPackages();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 tracking-tight">Luxury Collections</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore our curated experiences designed to preserve your most treasured moments with uncompromising quality and artistic vision.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {categories.map((category) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            setSelectedPackage={setSelectedPackage} 
          />
        ))}
      </div>
      
      <BookingModal 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
        packageData={selectedPackage ? { name: selectedPackage.name, features: selectedPackage.features.map(f => f.title) } : null} 
      />
    </div>
  );
}

export default PackagesPage;
