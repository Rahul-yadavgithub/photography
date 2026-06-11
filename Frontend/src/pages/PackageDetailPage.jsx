import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageById } from '../api/packageService';
import { Camera, Video, Image as ImageIcon, Film, BookOpen, Navigation, Play, Plus, Check } from 'lucide-react';
import { useIntent } from '../context/IntentContext';
import EditorialHero from '../components/common/EditorialHero';

const ICON_MAP = {
  camera: Camera,
  video: Video,
  gallery: ImageIcon,
  film: Film,
  album: BookOpen,
  drone: Navigation,
  live: Play
};

function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { executeProtectedAction } = useIntent();

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const data = await getPackageById(id);
        setPkg(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPkg();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="w-full min-h-screen pt-32 flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Package Not Found</h2>
          <Link to="/packages" className="text-[#ea580c] underline">Return to Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-32">

      <EditorialHero
        breadcrumbs={[
          { label: 'Packages', path: '/packages' },
          { label: pkg.category, path: `/category/${pkg.category.toLowerCase().replace(/\s+/g, '-')}` },
          { label: pkg.name }
        ]}
        label={pkg.category}
        title={pkg.name}
        description={pkg.shortDesc || pkg.description}
        action={
          <button
            onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW', { category: pkg.category, name: pkg.name, features: pkg.features.map(f => f.title) })}
            className="px-6 py-3 bg-white text-gray-900 font-bold tracking-widest uppercase text-xs rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
          >
            Book Consultation <Plus className="w-4 h-4" />
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      </div>

      {/* 2. Included Experiences Section */}
      <section id="experiences" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Included Experiences</h2>
          <div className="w-16 h-0.5 bg-[#ea580c] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pkg.features.map(feature => {
            const Icon = ICON_MAP[feature.iconKey] || Check;
            return (
              <div key={feature.id} className="premium-card p-8 group">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6 text-[#ea580c]" />
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Media Showcase (Gallery) */}
      {pkg.media.gallery && pkg.media.gallery.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-900 mb-4">The Portfolio</h2>
              <div className="w-16 h-0.5 bg-[#ea580c] mx-auto"></div>
              <p className="mt-6 text-gray-500 max-w-2xl mx-auto">A glimpse into the cinematic quality and timeless memories you can expect from this collection.</p>
            </div>

            {/* Masonry Layout via CSS Columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {pkg.media.gallery.map((img, idx) => (
                <div key={idx} className="break-inside-avoid overflow-hidden rounded-2xl relative group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Add-On Experience */}
      {pkg.allowAddOns && pkg.addOns && pkg.addOns.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Customize Your Package</h2>
            <div className="w-16 h-0.5 bg-[#ea580c] mx-auto"></div>
            <p className="mt-6 text-gray-500 max-w-2xl mx-auto">Elevate your experience with these premium optional upgrades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pkg.addOns.map(addon => {
              const Icon = ICON_MAP[addon.iconKey] || Plus;
              return (
                <div key={addon.id} className="premium-card p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    {pkg.showPricing !== false && addon.price && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full">+₹{addon.price}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h3>
                  <p className="text-sm text-gray-500 flex-grow">{addon.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sticky Bottom Inquiry Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 sm:p-6 z-50 transform translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-serif text-gray-900">{pkg.name}</h4>
            {pkg.showPricing !== false ? (
              <p className="text-gray-500 font-medium">Starting at <span className="font-bold text-gray-900">₹{pkg.price}</span></p>
            ) : (
              <p className="text-gray-500 font-medium">Contact for Custom Quote</p>
            )}
          </div>
          <button
            onClick={() => executeProtectedAction('OPEN_BOOKING_FLOW', { category: pkg.category, name: pkg.name, features: pkg.features.map(f => f.title) })}
            className="w-full sm:w-auto px-8 py-4 bg-[#ea580c] text-white font-bold rounded-full hover:bg-[#c2410c] hover:-translate-y-1 transition-all shadow-lg"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetailPage;
