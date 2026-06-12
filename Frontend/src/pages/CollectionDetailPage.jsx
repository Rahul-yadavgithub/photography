import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getPortfolio } from '../api/portfolioService';
import useSEO from '../hooks/useSEO';

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useSEO({
    title: collection ? `${collection.title} - Portfolio` : 'Collection',
    customSeoDescription: collection?.description
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCollection = async () => {
      try {
        const data = await getPortfolio();
        if (data && data.collections) {
          const found = data.collections.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === slug);
          setCollection(found);
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [slug]);

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (lightboxIndex === null || !collection?.images) return;
    
    if (e.key === 'Escape') {
      setLightboxIndex(null);
    } else if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % collection.images.length);
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + collection.images.length) % collection.images.length);
    }
  }, [lightboxIndex, collection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-serif mb-4">Collection Not Found</h1>
        <Link to="/portfolio" className="text-[#ea580c] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans w-full relative selection:bg-[#ea580c] selection:text-white pb-32">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={collection.coverImage || collection.images?.[0]}
            alt={collection.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Link to="/portfolio" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-8 flex items-center transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2" /> Return to Portfolio
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl">{collection.title}</h1>
          {collection.description && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed drop-shadow-md mb-8">
              {collection.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-[#ea580c]">
            <ImageIcon className="w-4 h-4" />
            <span>{collection.images?.length || 0} Photographs</span>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mt-12">
        {collection.images && collection.images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {collection.images.map((img, idx) => (
              <div 
                key={idx} 
                className="break-inside-avoid overflow-hidden relative group cursor-pointer bg-white/5"
                onClick={() => setLightboxIndex(idx)}
              >
                <img 
                  src={img} 
                  alt={`${collection.title} ${idx + 1}`} 
                  loading="lazy"
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No images available in this collection yet.
          </div>
        )}
      </section>

      {/* Luxury Lightbox */}
      {lightboxIndex !== null && collection.images && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          {/* Close Button */}
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + collection.images.length) % collection.images.length);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50 hidden md:flex"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % collection.images.length);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50 hidden md:flex"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image Container with Swipe Support (Basic implementation) */}
          <div 
            className="relative w-full max-w-6xl max-h-[90vh] px-4 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <img 
              src={collection.images[lightboxIndex]} 
              alt={`${collection.title} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500 cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.2em] font-bold">
              {lightboxIndex + 1} / {collection.images.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
