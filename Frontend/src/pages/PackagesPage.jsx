import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesWithPackages } from '../api/packageService';
import { ChevronRight, LayoutGrid, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { motion } from 'framer-motion';

function PackagesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen pb-24 overflow-hidden font-sans text-gray-900">

      {/* Premium Editorial Centered Text Hero */}
      <div className="relative w-full min-h-[260px] md:min-h-[320px] bg-[#0a0a0a] flex flex-col justify-center pt-28 pb-14 md:pt-36 md:pb-16 z-10">
        {/* Subtle Background Layer Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl flex flex-col items-center"
          >
            {/* Small Label */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#ea580c]">
                Explore Our Services
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-5 tracking-tight leading-[1.1]"
            >
              Discover Our Services
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-zinc-400 max-w-xl font-light leading-relaxed"
            >
              Explore our curated selection of premium photography and videography categories designed to beautifully capture your story.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-10 px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Packages', path: '/packages' }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="premium-card overflow-hidden flex flex-col group h-full">
              {/* Category Image - Fixed Height */}
              <div className="relative h-60 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {category.media?.thumbnail || category.media?.banner ? (
                  <img
                    src={category.media.thumbnail || category.media.banner}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <LayoutGrid className="w-16 h-16 text-gray-300" />
                )}

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                    {category.packages.length} Packages
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-grow flex flex-col bg-white">
                <div className="mb-4 flex-grow">
                  <h3 className="text-xl font-serif text-gray-900 mb-2 leading-snug group-hover:text-[#ea580c] transition-colors">{category.name}</h3>
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide leading-relaxed line-clamp-2">
                    {category.shortDescription || category.description || "Premium photography service"}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Starting From</span>
                      <span className="text-xl font-bold text-gray-900">
                        {category.startingPrice ? `₹${category.startingPrice}` : 'Custom Quote'}
                      </span>
                    </div>

                    <Link
                      to={`/category/${category.id}`}
                      className="px-5 py-2 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#c2410c] transition-colors shadow-md flex items-center gap-2"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PackagesPage;
