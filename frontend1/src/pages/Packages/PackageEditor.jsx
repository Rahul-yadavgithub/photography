import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe, Info, DollarSign, ListChecks, PlusCircle, Settings as SettingsIcon, Image as ImageIcon, Sparkles, CheckCircle2, X } from 'lucide-react';
import OffersDashboard from '../../components/Offers/OffersDashboard';
import FeaturesManager from '../../components/PackageFeatures/FeaturesManager';
import AddOnsManager from '../../components/PackageAddOns/AddOnsManager';
import MediaManager from '../../components/PackageMedia/MediaManager';
import SettingsManager from '../../components/PackageSettings/SettingsManager';
import PackageLivePreview from '../../components/Packages/PackageLivePreview';
import { usePackagesApi } from '../../api/packages';
import { useCategoriesApi } from '../../api/categories';

const PackageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [toastMessage, setToastMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { getPackage, createPackage, updatePackage } = usePackagesApi();
  const { getCategories } = useCategoriesApi();
  const [categories, setCategories] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: isEditing ? 'Luxury Wedding Package' : '',
    category: 'Wedding Photography',
    status: 'Published',
    featured: true,
    price: '5000',
    discountPrice: '',
    shortDesc: 'A premium full-day wedding coverage.',
    description: 'Comprehensive luxury wedding coverage including drone, 2 cinematographers, and premium albums.'
  });

  const [features, setFeatures] = useState([
    { id: 1, title: '1 Photographer', description: 'Professional wedding photographer covering the complete event.', iconKey: 'camera', status: 'Active' },
    { id: 2, title: '1 Videographer', description: 'Dedicated videographer capturing cinematic moments.', iconKey: 'video', status: 'Active' },
    { id: 3, title: 'Full Day Coverage (8 Hours)', description: 'Complete event coverage from preparation to celebration.', iconKey: 'clock', status: 'Active' }
  ]);

  const [addOns, setAddOns] = useState([
    { id: 1, name: 'Drone Coverage', description: 'Aerial cinematic wedding coverage.', price: '5000', iconKey: 'drone', status: 'Active' },
    { id: 2, name: 'Premium Album', description: 'High-quality 40-page printed album.', price: '12000', iconKey: 'album', status: 'Active' }
  ]);

  const [mediaConfig, setMediaConfig] = useState({
    thumbnail: null,
    banner: null,
    gallery: [],
    videoUrl: ''
  });

  const [settingsConfig, setSettingsConfig] = useState({
    status: 'Published',
    isFeatured: true,
    isPopular: false,
    showPricing: true,
    allowAddOns: true,
    availability: 'Available'
  });

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'pricing', label: 'Pricing & Offers', icon: DollarSign },
    { id: 'features', label: 'Features', icon: ListChecks },
    { id: 'addons', label: 'Add-Ons', icon: PlusCircle },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  React.useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchAllCategories();

    if (isEditing) {
      const fetchPackage = async () => {
        try {
          const data = await getPackage(id);
          if (data.success) {
            const pkg = data.data;
            setFormData({
              name: pkg.name || '',
              category: pkg.category || 'Wedding Photography',
              status: pkg.status || 'Published',
              featured: pkg.isFeatured || false,
              price: pkg.price || '',
              discountPrice: pkg.discountPrice || '',
              shortDesc: pkg.shortDesc || '',
              description: pkg.description || ''
            });
            if (pkg.features) setFeatures(pkg.features.map((f, i) => ({ ...f, id: f._id || f.id || `f-${i}` })));
            if (pkg.addOns) setAddOns(pkg.addOns.map((a, i) => ({ ...a, id: a._id || a.id || `a-${i}` })));
            if (pkg.media) setMediaConfig(pkg.media);
            setSettingsConfig({
              status: pkg.status || 'Published',
              isFeatured: pkg.isFeatured || false,
              isPopular: pkg.isPopular || false,
              showPricing: pkg.showPricing !== false,
              allowAddOns: pkg.allowAddOns !== false,
              availability: pkg.availability || 'Available'
            });
          }
        } catch (error) {
          console.error("Error fetching package:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPackage();
    }
  }, [id, isEditing]);

  const handleSave = async () => {
    if (!formData.name || formData.name.trim() === '') {
      alert('Please enter a Package Name before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        features: features.map(({ id, ...f }) => f),
        addOns: addOns.map(({ id, ...addon }) => ({ ...addon, price: addon.price ? Number(addon.price) : undefined })),
        media: {
          ...mediaConfig,
          videoUrl: mediaConfig.videoUrl && mediaConfig.videoUrl.trim() !== '' ? mediaConfig.videoUrl : undefined
        },
        ...settingsConfig
      };

      let data;
      if (isEditing) {
        data = await updatePackage(id, payload);
      } else {
        data = await createPackage(payload);
      }
      
      if (data.success) {
        setToastMessage(isEditing ? 'Package updated successfully!' : 'Package created successfully!');
        if (!isEditing) {
          setTimeout(() => {
            navigate('/packages');
          }, 2000);
        } else {
          setTimeout(() => {
            setToastMessage(null);
          }, 3000);
        }
      } else {
        alert('Failed to save package: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-zinc-500">Loading package data...</div>;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans text-zinc-900 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold tracking-wide text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          <Link to="/packages" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all duration-300 shadow-sm hover:shadow">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{isEditing ? 'Edit Package' : 'Create New Package'}</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">{formData.name || 'Untitled Package'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold rounded-xl hover:bg-zinc-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <Globe className="w-4 h-4" /> Preview
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Content Layout - Using strict CSS Grid for guaranteed alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm sticky top-6">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Configuration</span>
          </div>
          <nav className="p-3 space-y-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-zinc-900 text-white shadow-md' 
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRightIcon className="w-4 h-4 text-zinc-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-10 min-h-[600px]">
          
          {/* --- OVERVIEW TAB --- */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="border-b border-zinc-100 pb-5">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Basic Information</h2>
                <p className="text-zinc-500 text-sm mt-1 font-medium">Configure the core details of your package.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Package Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base font-medium shadow-sm hover:border-zinc-300" placeholder="e.g. Platinum Wedding Package" />
                </div>
                <div className="space-y-3 group">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base font-medium shadow-sm hover:border-zinc-300 appearance-none cursor-pointer">
                    <option value="" disabled>Select a category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.categoryName}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide flex justify-between">
                  <span>Short Description</span>
                  <span className="text-zinc-400 font-medium normal-case">Max 120 chars</span>
                </label>
                <textarea maxLength="120" value={formData.shortDesc} onChange={(e) => setFormData({...formData, shortDesc: e.target.value})} rows="2" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base font-medium shadow-sm hover:border-zinc-300 resize-none" placeholder="Brief 1-sentence summary displayed on cards."></textarea>
              </div>

              <div className="space-y-3 group">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Full Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="5" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base font-medium shadow-sm hover:border-zinc-300 resize-y" placeholder="Detailed description of what the package entails."></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-colors">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Featured Package
                  </h4>
                  <p className="text-sm text-zinc-500 font-medium mt-1">Highlight this package on the homepage and top of category.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="sr-only peer" />
                  <div className="w-14 h-7 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zinc-900 shadow-inner border border-zinc-300 peer-checked:border-zinc-900"></div>
                </label>
              </div>
            </div>
          )}

          {/* --- PRICING TAB --- */}
          {activeTab === 'pricing' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="border-b border-zinc-100 pb-5">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Pricing & Offers</h2>
                <p className="text-zinc-500 text-sm mt-1 font-medium">Manage the cost and promotional offers for this package.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Robust Input Group for Starting Price */}
                <div className="space-y-3 group">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Starting Price</label>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5 focus-within:border-zinc-900 transition-all shadow-sm group-hover:border-zinc-300">
                    <div className="px-4 py-3.5 bg-zinc-100 border-r border-zinc-200 text-zinc-500 font-bold">
                      ₹
                    </div>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-zinc-900 text-lg font-bold" 
                      placeholder="5000"
                    />
                  </div>
                </div>
                
                {/* Robust Input Group for Discount Price */}
                <div className="space-y-3 group">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Discount Price <span className="text-zinc-400 normal-case font-medium ml-1">(Optional)</span></label>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5 focus-within:border-zinc-900 transition-all shadow-sm group-hover:border-zinc-300">
                    <div className="px-4 py-3.5 bg-zinc-100 border-r border-zinc-200 text-zinc-500 font-bold">
                      ₹
                    </div>
                    <input 
                      type="number" 
                      value={formData.discountPrice} 
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} 
                      placeholder="e.g. 4500" 
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-zinc-900 text-lg font-bold" 
                    />
                  </div>
                </div>
              </div>

              {/* Premium Promotional Offer Panel */}
              <div className="mt-12">
                <OffersDashboard />
              </div>
            </div>
          )}

          {/* --- FEATURES TAB --- */}
          {activeTab === 'features' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <FeaturesManager features={features} setFeatures={setFeatures} />
            </div>
          )}

          {/* --- ADD-ONS TAB --- */}
          {activeTab === 'addons' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <AddOnsManager addOns={addOns} setAddOns={setAddOns} />
            </div>
          )}

          {/* --- MEDIA TAB --- */}
          {activeTab === 'media' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <MediaManager media={mediaConfig} setMedia={setMediaConfig} />
            </div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <SettingsManager settings={settingsConfig} setSettings={setSettingsConfig} />
            </div>
          )}

        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-zinc-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Live Package Preview</h3>
                <p className="text-sm text-zinc-500 font-medium">Customer View Simulation</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-zinc-50/30">
              <PackageLivePreview 
                formData={formData} 
                features={features} 
                addOns={addOns} 
                media={mediaConfig} 
                settings={settingsConfig} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icons
const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
const AwardIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);

export default PackageEditor;
