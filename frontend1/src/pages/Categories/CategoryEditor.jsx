import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Plus, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCategoriesApi } from '../../api/categories';
import AIGenerationOverlay from '../../components/Categories/AIGenerationOverlay';
import ImageUploader from '../../components/PackageMedia/ImageUploader';

const CategoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { getCategory, createCategory, updateCategory, generateCategoryContent } = useCategoriesApi();

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Can be kept for button disable state
  const [isLoading, setIsLoading] = useState(isEditing);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  
  // AI Overlay State
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState('GENERATING'); // GENERATING, SUCCESS, ERROR

  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    heroHeading: '',
    shortDescription: '',
    fullDescription: '',
    features: [''],
    highlights: [''],
    faq: [{ question: '', answer: '' }],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    displayOrder: 0,
    featured: false,
    status: 'Published',
    media: { thumbnail: '', banner: '' }
  });

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCategory = async () => {
    try {
      const res = await getCategory(id);
      if (res.success) {
        setFormData({
            ...res.data,
            features: res.data.features?.length ? res.data.features : [''],
            highlights: res.data.highlights?.length ? res.data.highlights : [''],
            faq: res.data.faq?.length ? res.data.faq : [{ question: '', answer: '' }],
            media: res.data.media || { thumbnail: '', banner: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching category', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      media: { ...prev.media, [name]: value }
    }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleFaqChange = (index, key, value) => {
    const newFaq = [...formData.faq];
    newFaq[index][key] = value;
    setFormData({ ...formData, faq: newFaq });
  };

  const addFaq = () => {
    setFormData({ ...formData, faq: [...formData.faq, { question: '', answer: '' }] });
  };

  const removeFaq = (index) => {
    const newFaq = formData.faq.filter((_, i) => i !== index);
    setFormData({ ...formData, faq: newFaq });
  };

  const handleGenerate = async () => {
    if (!formData.categoryName) {
      setToast({ type: 'error', message: 'Please enter a Category Name first.' });
      return;
    }
    
    // Start Overlay
    setShowOverlay(true);
    setOverlayStatus('GENERATING');
    setIsGenerating(true);

    try {
      const res = await generateCategoryContent(formData.categoryName);
      if (res.success && res.data) {
        setOverlayStatus('SUCCESS');
        
        // Wait 1.5s for user to see the success state, then populate & close
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            ...res.data,
            features: res.data.features?.length ? res.data.features : [''],
            highlights: res.data.highlights?.length ? res.data.highlights : [''],
            faq: res.data.faq?.length ? res.data.faq : [{ question: '', answer: '' }]
          }));
          setShowOverlay(false);
          setIsGenerating(false);
          setToast({ type: 'success', message: 'Content applied to form.' });
        }, 1500);

      } else {
        setOverlayStatus('ERROR');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Generation error', error);
      setOverlayStatus('ERROR');
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.categoryName) {
      setToast({ type: 'error', message: 'Category Name is required.' });
      return;
    }
    setIsSaving(true);
    try {
      // Clean up empty arrays before save
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        faq: formData.faq.filter(f => f.question.trim() !== '' && f.answer.trim() !== '')
      };

      let res;
      if (isEditing) {
        res = await updateCategory(id, payload);
      } else {
        res = await createCategory(payload);
      }

      if (res.success) {
        setToast({ type: 'success', message: 'Category saved successfully!' });
        setTimeout(() => navigate('/categories'), 1500);
      } else {
        setToast({ type: 'error', message: res.message || 'Failed to save category.' });
      }
    } catch (error) {
      console.error('Save error', error);
      setToast({ type: 'error', message: 'Network error or server unavailable.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-zinc-500 font-medium">Loading category...</div>;
  }

  return (
    <>
      <AIGenerationOverlay 
        isOpen={showOverlay}
        status={overlayStatus}
        onRetry={() => {
          setShowOverlay(false);
          // Wait for overlay close animation before retrying
          setTimeout(handleGenerate, 300);
        }}
        onDismiss={() => {
          setShowOverlay(false);
          setIsGenerating(false);
        }}
      />

      <div className="w-full max-w-5xl mx-auto pb-24 font-sans text-zinc-900 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'error' ? 'bg-red-500/95 border-red-400 text-white' : 'bg-zinc-900/95 border-zinc-800 text-white'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <span className="font-semibold tracking-wide text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-white/20 rounded-full transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 mt-6">
        <div className="flex items-center gap-5">
          <Link to="/categories" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{isEditing ? 'Edit Category' : 'Create Category'}</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Manage marketing content and SEO</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-all border border-indigo-200 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Core Info */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6">Core Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Category Name</label>
              <input type="text" name="categoryName" value={formData.categoryName} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium" placeholder="e.g. Wedding Photography" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">URL Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium" placeholder="Auto-generated if left blank" />
            </div>
          </div>
        </div>

        {/* Marketing Content */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6">Marketing Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Hero Heading</label>
              <input type="text" name="heroHeading" value={formData.heroHeading} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Short Description (For Cards)</label>
              <textarea name="shortDescription" rows="2" value={formData.shortDescription} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Full Description (Detail Page)</label>
              <textarea name="fullDescription" rows="5" value={formData.fullDescription} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium"></textarea>
            </div>
          </div>
        </div>

        {/* Features & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-6">Features</h2>
            <div className="space-y-3">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={feature} onChange={(e) => handleArrayChange(idx, 'features', e.target.value)} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-900 font-medium" placeholder="Feature..." />
                  <button onClick={() => removeArrayItem(idx, 'features')} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-lg border border-zinc-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayItem('features')} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-6">Highlights</h2>
            <div className="space-y-3">
              {formData.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={highlight} onChange={(e) => handleArrayChange(idx, 'highlights', e.target.value)} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-900 font-medium" placeholder="Highlight..." />
                  <button onClick={() => removeArrayItem(idx, 'highlights')} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-lg border border-zinc-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayItem('highlights')} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                <Plus className="w-4 h-4" /> Add Highlight
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {formData.faq.map((item, idx) => (
              <div key={idx} className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 relative">
                <button onClick={() => removeFaq(idx)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
                <input type="text" value={item.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} className="w-[90%] px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-900 font-bold" placeholder="Question" />
                <textarea value={item.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} rows="2" className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-900 font-medium resize-none" placeholder="Answer"></textarea>
              </div>
            ))}
            <button onClick={addFaq} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6">Search Engine Optimization</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">SEO Title</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Meta Description</label>
              <textarea name="seoDescription" rows="2" value={formData.seoDescription} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Keywords</label>
              <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-medium" placeholder="comma, separated, keywords" />
            </div>
          </div>
        </div>

        {/* Media Uploads */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-zinc-400" /> Media & Images
          </h2>
          <p className="text-sm text-zinc-500 font-medium mb-6">Upload high-quality images for your category display.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageUploader 
              label="Thumbnail Image" 
              description="Used in category cards and grid layouts." 
              recommendedSize="800 × 800"
              folder="categories"
              image={formData.media.thumbnail}
              onUpload={(url) => setFormData(prev => ({ ...prev, media: { ...prev.media, thumbnail: url } }))}
              onDelete={() => setFormData(prev => ({ ...prev, media: { ...prev.media, thumbnail: '' } }))}
            />
            <ImageUploader 
              label="Hero Banner" 
              description="Displayed as the background header on the category page." 
              recommendedSize="1920 × 1080"
              folder="categories"
              image={formData.media.banner}
              onUpload={(url) => setFormData(prev => ({ ...prev, media: { ...prev.media, banner: url } }))}
              onDelete={() => setFormData(prev => ({ ...prev, media: { ...prev.media, banner: '' } }))}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6">Display Settings</h2>
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-bold">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-24 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 font-bold" />
            </div>
            <div className="flex items-center gap-3 mt-8">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
              </label>
              <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Featured Category</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default CategoryEditor;
