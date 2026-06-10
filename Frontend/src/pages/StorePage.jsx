import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Heart, ZoomIn } from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: "Premium Wedding Album", desc: "Handcrafted Italian leather lay-flat album with luxury thick pages.", price: "$299", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800", rating: 5, reviews: 124 },
  { id: 2, name: "Gallery Canvas Print", desc: "Museum-quality textured canvas print, ready to hang.", price: "$149", image: "https://images.unsplash.com/photo-1577083165249-14a09ebbf043?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviews: 89 },
  { id: 3, name: "Luxury Acrylic Block", desc: "Sleek, modern 1-inch thick freestanding acrylic photo block.", price: "$89", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviews: 210 },
  { id: 4, name: "Custom Linen Photo Book", desc: "Elegant linen cover perfect for pre-wedding or family shoots.", price: "$129", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviews: 56 },
  { id: 5, name: "Wooden Framed Print", desc: "Classic solid oak wood frame with premium matte photo paper.", price: "$119", image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviews: 145 },
  { id: 6, name: "Personalized Gift Box", desc: "A curated box of 20 polaroid-style prints and a wooden stand.", price: "$49", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviews: 312 },
];

const CATEGORIES = [
  { name: "Albums & Books", count: 12, image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400" },
  { name: "Wall Decor", count: 24, image: "https://images.unsplash.com/photo-1577083165249-14a09ebbf043?auto=format&fit=crop&q=80&w=400" },
  { name: "Gifts & Accessories", count: 36, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400" },
  { name: "Custom Merchandise", count: 18, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" }
];

const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1577083165249-14a09ebbf043?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"
];

const StoreHero = () => (
  <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1520626337972-8eeeb2c4db58?auto=format&fit=crop&q=80&w=2000" alt="Premium Lifestyle Store" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-24">
      <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
        Turn Your Memories Into <br/><span className="italic text-[#ea580c]">Timeless Keepsakes</span>
      </h1>
      <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl font-light tracking-wide leading-relaxed">
        Upload your favorite moments and transform them into premium-quality personalized products, handcrafted to last a lifetime.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button className="bg-[#ea580c] text-white px-10 py-4 rounded-sm hover:bg-[#c2410c] transition-all duration-300 tracking-widest text-xs font-bold uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Now</span>
        </button>
        <button className="bg-transparent border border-white text-white backdrop-blur-sm px-10 py-4 rounded-sm hover:bg-white hover:text-black transition-all duration-300 tracking-widest text-xs font-bold uppercase">
          Explore Products
        </button>
      </div>
    </div>
  </section>
);

const BrowseCategories = () => (
  <section className="py-24 bg-white relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Shop By Category</h2>
        <p className="text-gray-600 text-lg">Find the perfect format for your photos.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 h-80 flex flex-col justify-end">
            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 p-6">
              <h3 className="text-2xl font-serif text-white mb-1 group-hover:text-[#ea580c] transition-colors">{cat.name}</h3>
              <p className="text-gray-300 text-sm font-medium tracking-wide uppercase">{cat.count} Products</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = () => (
  <section className="py-24 bg-[#f8fafc] relative z-20 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Bestselling Keepsakes</h2>
          <p className="text-gray-600 text-lg">Our most loved premium products.</p>
        </div>
        <button className="hidden md:flex items-center text-gray-900 hover:text-[#ea580c] font-bold text-xs uppercase tracking-widest transition-colors">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col">
            <div className="w-full h-[350px] relative overflow-hidden bg-gray-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:text-[#ea580c] shadow-sm transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full text-xs tracking-widest font-bold uppercase flex items-center space-x-2 shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                  <span>Quick View</span>
                </div>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:text-[#ea580c] transition-colors">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{product.desc}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Starting at</p>
                  <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                </div>
                <Link to={`/store/product/${product.id}`} className="bg-gray-900 text-white px-6 py-3 rounded text-xs tracking-widest font-bold uppercase hover:bg-[#ea580c] transition-colors shadow-md">
                  Customize
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-12 w-full md:hidden flex justify-center items-center text-gray-900 border border-gray-300 py-4 rounded font-bold text-xs uppercase tracking-widest">
        View All Products
      </button>
    </div>
  </section>
);

const ProductShowcase = () => (
  <section className="py-24 bg-white relative z-20">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight mb-4">Inspiration Showcase</h2>
        <p className="text-gray-600 text-lg">See how others are styling their memories.</p>
      </div>
      
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {SHOWCASE_IMAGES.map((img, idx) => (
          <div key={idx} className="break-inside-avoid mb-6 relative group rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300">
            <img src={img} alt="Showcase" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <button className="bg-white text-gray-900 px-6 py-3 rounded-full text-xs tracking-widest font-bold uppercase hover:bg-[#ea580c] hover:text-white transition-colors">
                  Shop This Look
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function StorePage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 relative">
      <StoreHero />
      <FeaturedProducts />
      <BrowseCategories />
      <ProductShowcase />
    </div>
  );
}
