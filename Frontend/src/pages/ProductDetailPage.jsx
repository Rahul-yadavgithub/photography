import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductDetails } from '../api/storeService';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useUser } from '@clerk/clerk-react';
import useSEO from '../hooks/useSEO';
import { useCart } from '../context/CartContext';
import PremiumLoader from '../components/shared/PremiumLoader';

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useSEO({ title: product ? product.name : null, customSeoTitle: product?.seoTitle, customSeoDescription: product?.seoDescription });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetails(slug);
        setProduct(data);
        if (data && data.galleryImages && data.galleryImages.length > 0) {
          setSelectedImage(data.galleryImages[0]);
        } else if (data && data.coverImage) {
          setSelectedImage(data.coverImage);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-20 flex items-center justify-center">
        <PremiumLoader text="PREPARING PRODUCT..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/store" className="text-[#ea580c] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const allImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.coverImage];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 pb-24">
      {/* Dynamic Hero Banner */}
      {product.bannerImage && (
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-black">
          <img src={product.bannerImage} alt={product.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/50"></div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${product.bannerImage ? '-mt-24 relative z-10' : 'pt-32'}`}>
        <div className="mb-6 bg-white/80 backdrop-blur-sm inline-block px-4 py-2 rounded-lg shadow-sm">
          <Breadcrumbs items={[
            { label: 'Store', path: '/store' },
            { label: product.category?.name || 'Category', path: '/store' },
            { label: product.name, path: `/store/product/${product.slug}` }
          ]} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">

            {/* Image Gallery Column */}
            <div className="lg:w-1/2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50 flex flex-col">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-white mb-4">
                {selectedImage ? (
                  <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                    {product.stockStatus}
                  </span>
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-colors ${selectedImage === img ? 'border-[#ea580c]' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="lg:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">
                  {product.category?.name}
                </span>
                {product.isFeatured && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded">Featured</span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Price</span>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-gray-900">₹{product.salePrice || product.basePrice}</span>
                    {product.salePrice && product.basePrice > product.salePrice && (
                      <span className="text-xl text-gray-600 line-through">₹{product.basePrice}</span>
                    )}
                  </div>
                </div>
                {product.discountPercentage > 0 && (
                  <span className="px-3 py-1 mb-1 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              <div className="prose prose-sm text-gray-700 mb-8 max-w-none">
                <p className="text-lg leading-relaxed font-medium text-gray-900 mb-4">{product.shortDescription}</p>
                {product.description && <p className="leading-relaxed">{product.description}</p>}
              </div>

              {/* Specifications Block */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#ea580c]" /> Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value) return null; // Don't show empty fields
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
                      
                      return (
                        <div key={key} className={['coverMaterial', 'minimumOrderQuantity', 'customPhotoSupport', 'customDesignSupport', 'customLogoSupport'].includes(key) ? 'col-span-2 flex flex-col' : 'flex flex-col'}>
                          <span className="text-gray-600 text-xs uppercase mb-1">{formattedKey}</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#ea580c] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
                <p className="text-center text-xs text-gray-600 mt-4">
                  For customization requests, please contact us directly.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
