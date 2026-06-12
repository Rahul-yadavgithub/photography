import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoreCategories, getStoreProducts } from '../api/storeService';
import useSEO from '../hooks/useSEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const floatVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const StoreHero = () => (
  <div className="relative w-full min-h-[35vh] md:min-h-[45vh] bg-[#0a0a0a] flex flex-col justify-center pt-28 pb-14 md:pt-36 md:pb-16 z-10 overflow-hidden">
    {/* Subtle Background Layer Gradients */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/15 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ea580c]/5 via-transparent to-transparent"></div>
    </div>

    <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl flex flex-col items-center"
      >
        {/* Small Label */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#ea580c]">
            Explore Our Store
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="flex flex-col items-center justify-center space-y-2 md:space-y-4"
        >
          <motion.span
            variants={itemVariants}
            className="text-3xl md:text-5xl lg:text-6xl font-serif text-white font-light tracking-tight leading-tight"
          >
            Turn Your Memories Into
          </motion.span>
          <motion.span
            variants={floatVariants}
            initial="hidden"
            animate={["visible", "animate"]}
            className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-[#ea580c] tracking-tight leading-tight"
          >
            Timeless Keepsakes
          </motion.span>
        </motion.h1>
      </motion.div>
    </div>
  </div>
);

const BrowseCategories = ({ categories, onSelectCategory, selectedCategory }) => (
  <section className="py-24 bg-white relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Shop By Category</h2>
        <p className="text-gray-600 text-lg">Find the perfect format for your photos.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <div
          onClick={() => onSelectCategory(null)}
          className={`group relative overflow-hidden rounded-full px-6 py-3 cursor-pointer border shadow-sm transition-all duration-300 ${!selectedCategory ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
          <span className="text-sm font-medium tracking-wide">All Products</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`group relative overflow-hidden rounded-full px-6 py-3 cursor-pointer border shadow-sm transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
            <span className="text-sm font-medium tracking-wide">{cat.name}</span>
          </div>
        ))}
      </div>

    </div>
  </section>
);

const FeaturedProducts = ({ products }) => (
  <section className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Our Products</h2>
          <p className="text-gray-600 text-lg">Premium keepsakes handcrafted to last a lifetime.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          No products available in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="premium-card bg-white border border-zinc-200 shadow-md hover:shadow-xl rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-300">
              <div className="relative h-60 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {product.coverImage ? (
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <LayoutGrid className="w-16 h-16 text-gray-300" />
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm`}>
                    {product.stockStatus}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col bg-white">
                <div className="mb-4 flex-grow">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#ea580c] mb-2">{product.category?.name}</div>
                  <h3 className="text-2xl font-serif text-black mb-2 leading-snug group-hover:text-[#ea580c] transition-colors">{product.name}</h3>
                  <p className="text-black text-[12px] font-bold uppercase tracking-wide leading-relaxed line-clamp-2 mb-4">
                    {product.shortDescription}
                  </p>

                  {/* Specifications badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.specifications && Object.values(product.specifications).slice(0, 3).map((val, idx) => (
                      val ? <span key={idx} className="text-[11px] font-bold bg-zinc-100 border border-zinc-200 text-black px-2.5 py-1 rounded-md">{val}</span> : null
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="border-t border-gray-200 mb-4"></div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-bold text-black uppercase tracking-widest mb-0.5">Price</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-black">
                          ₹{product.salePrice || product.basePrice}
                        </span>
                        {product.salePrice && product.basePrice > product.salePrice && (
                          <span className="text-sm font-bold text-gray-600 line-through">₹{product.basePrice}</span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/store/product/${product.slug}`}
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
      )}
    </div>
  </section>
);

export default function StorePage() {
  useSEO();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          getStoreCategories(),
          getStoreProducts(selectedCategory)
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Error loading store data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  if (loading && categories.length === 0) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ea580c] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 relative">
      <StoreHero />
      <BrowseCategories
        categories={categories}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <FeaturedProducts products={products} />
    </div>
  );
}
