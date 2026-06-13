import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getCategoryBySlug, getCategoriesWithPackages } from '../api/packageService';
import { getActiveOffers } from '../api/offerService';
import { ChevronRight, LayoutGrid, CheckCircle2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import EditorialHero from '../components/common/EditorialHero';
import AutoScrollingPackageCarousel from '../components/shared/AutoScrollingPackageCarousel';
import PremiumLoader from '../components/shared/PremiumLoader';
import useSEO from '../hooks/useSEO';

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-6 text-left bg-white focus:outline-none"
      >
        <span className="font-bold text-gray-900 text-lg pr-8">{faq.question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

function CategoryDetailPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);

  useSEO({ title: category ? category.categoryName : null, customSeoTitle: category?.seoTitle, customSeoDescription: category?.seoDescription });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // We get category data and also its associated packages
        const [catData, allCategoriesWithPackages] = await Promise.all([
          getCategoryBySlug(slug),
          getCategoriesWithPackages()
        ]);
        
        setCategory(catData);
        
        // Find the matching category to extract its active packages
        const matchedCat = allCategoriesWithPackages.find(c => c.id === slug);
        if (matchedCat && matchedCat.packages) {
          const offersData = await getActiveOffers();
          // Attach applicable offers to packages
          const packagesWithOffers = matchedCat.packages.map(pkg => {
            const pkgOffers = offersData.filter(o => o.applicablePackages.some(ap => ap._id === pkg._id || ap.id === pkg._id || ap === pkg._id || ap.slug === pkg.slug || ap._id === pkg.id));
            return { ...pkg, offers: pkgOffers, offer: pkgOffers[0] };
          });
          setPackages(packagesWithOffers);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-20 flex items-center justify-center">
        <PremiumLoader text="CURATING CATEGORY..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-[#f8fafc] w-full min-h-screen pt-32 pb-24 flex items-center justify-center flex-col">
        <h2 className="text-3xl font-bold mb-4">Category Not Found</h2>
        <Link to="/packages" className="text-blue-600 font-bold hover:underline">Return to Packages</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen pb-24 font-sans text-gray-900">
      
      <EditorialHero 
        breadcrumbs={[
          { label: 'Packages', path: '/packages' },
          { label: category.categoryName, path: `/category/${category.id}` }
        ]}
        label="Premium Packages"
        title={category.heroHeading || category.categoryName}
        description={category.shortDescription || `Explore our tailored ${category.categoryName.toLowerCase()} photography packages.`}
      />
      
      {/* 1. AVAILABLE PACKAGES (FIRST CONTENT BLOCK) */}
      {packages.length > 0 && (
        <div className="w-full mt-16 mb-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative mb-12">
            <div className="relative flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ea580c] mb-2">Available Packages</span>
              <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Choose Your Experience</h2>
              <p className="text-gray-500 text-base max-w-2xl">
                Choose the perfect configuration for your {category.categoryName.toLowerCase()} experience.
              </p>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                {packages.length} {packages.length === 1 ? 'Option' : 'Options'}
              </div>
            </div>
          </div>

          <AutoScrollingPackageCarousel packages={packages} />
        </div>
      )}

      {/* REMAINDER CONTENT WRAPPER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Overview & Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24 border-t border-gray-200/80 pt-16">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif text-gray-900 mb-6 tracking-tight">Overview</h2>
            {category.fullDescription ? (
              category.fullDescription.split('\\n').map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-lg text-gray-600 leading-relaxed">
                Explore our premium offerings for {category.categoryName}. We provide the best service configurations tailored to your needs.
              </p>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-widest text-sm">Key Highlights</h3>
              <ul className="space-y-4">
                {category.highlights && category.highlights.length > 0 ? (
                  category.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">Premium quality guaranteed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Included Features */}
        {category.features && category.features.length > 0 && (
          <div className="mb-24">
            <h2 className="text-3xl font-serif text-gray-900 mb-10 text-center tracking-tight">Included Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                    <CheckCircle2 className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="font-bold text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Frequently Asked Questions */}
        {category.faq && category.faq.length > 0 && (
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl font-serif text-gray-900 mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
            <div>
              {category.faq.map((faqItem, index) => (
                <FAQItem key={index} faq={faqItem} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CategoryDetailPage;
