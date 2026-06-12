import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoreApi } from '../../api/store';
import { useMediaApi } from '../../api/media';
import { useNotification } from '../../context/NotificationContext';
import { Save, ArrowLeft, Image as ImageIcon, Upload, Trash2, X } from 'lucide-react';

const categorySpecificationsConfig = {
  'Wedding Album': [
    { key: 'albumSize', label: 'Album Size', placeholder: 'e.g., 12x18, 10x14' },
    { key: 'albumType', label: 'Album Type', placeholder: 'e.g., Layflat Premium' },
    { key: 'pageCount', label: 'Page Count', placeholder: 'e.g., 40 Pages' },
    { key: 'printQuality', label: 'Print Quality', placeholder: 'e.g., HD, Ultra HD' },
    { key: 'coverMaterial', label: 'Cover Material', placeholder: 'e.g., Leather, Acrylic, Velvet' },
  ],
  'Wedding Card Printing': [
    { key: 'cardSize', label: 'Card Size', placeholder: 'e.g., 5x7 Inch' },
    { key: 'cardMaterial', label: 'Card Material', placeholder: 'e.g., Matte, Premium Paper' },
    { key: 'printingType', label: 'Printing Type', placeholder: 'e.g., Digital, Offset' },
    { key: 'envelopeIncluded', label: 'Envelope Included', placeholder: 'e.g., Yes / No' },
    { key: 'minimumOrderQuantity', label: 'Minimum Order Quantity', placeholder: 'e.g., 100' },
  ],
  'Printed Mug': [
    { key: 'capacity', label: 'Capacity', placeholder: 'e.g., 330ml' },
    { key: 'material', label: 'Material', placeholder: 'e.g., Ceramic' },
    { key: 'printType', label: 'Print Type', placeholder: 'e.g., Sublimation' },
    { key: 'color', label: 'Color', placeholder: 'e.g., White, Black' },
    { key: 'customPhotoSupport', label: 'Custom Photo Support', placeholder: 'e.g., Yes / No' },
  ],
  'Printed Keychain': [
    { key: 'material', label: 'Material', placeholder: 'e.g., Acrylic, Metal' },
    { key: 'shape', label: 'Shape', placeholder: 'e.g., Round, Rectangle' },
    { key: 'size', label: 'Size', placeholder: 'e.g., 2 Inch' },
    { key: 'printingType', label: 'Printing Type', placeholder: 'e.g., UV Print' },
    { key: 'customPhotoSupport', label: 'Custom Photo Support', placeholder: 'e.g., Yes / No' },
  ],
  'Printed Water Bottle': [
    { key: 'capacity', label: 'Capacity', placeholder: 'e.g., 750ml' },
    { key: 'material', label: 'Material', placeholder: 'e.g., Stainless Steel' },
    { key: 'color', label: 'Color', placeholder: 'e.g., Black, White' },
    { key: 'printType', label: 'Print Type', placeholder: 'e.g., UV Print' },
    { key: 'customDesignSupport', label: 'Custom Design Support', placeholder: 'e.g., Yes / No' },
  ],
  'Printed Cap': [
    { key: 'material', label: 'Material', placeholder: 'e.g., Cotton' },
    { key: 'capType', label: 'Cap Type', placeholder: 'e.g., Baseball, Sports' },
    { key: 'color', label: 'Color', placeholder: 'e.g., Black, White, Blue' },
    { key: 'printType', label: 'Print Type', placeholder: 'e.g., Print, Embroidery' },
    { key: 'customLogoSupport', label: 'Custom Logo Support', placeholder: 'e.g., Yes / No' },
  ]
};

const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { getProducts, getCategories, createProduct, updateProduct } = useStoreApi();
  const { uploadImage } = useMediaApi();
  const { showSuccess, showError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    name: '', slug: '', shortDescription: '', description: '', category: '',
    bannerImage: '', coverImage: '', galleryImages: [],
    specifications: {},
    basePrice: '', salePrice: '', discountPercentage: '',
    stockStatus: 'In Stock', isFeatured: false, isActive: true, displayOrder: 0
  });

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.success) setCategories(catRes.data);

        if (isEditMode) {
          const prodRes = await getProducts(); // In a real app we'd fetch product by ID. Here we filter from all.
          if (prodRes.success) {
            const product = prodRes.data.find(p => p._id === id);
            if (product) {
              setFormData({
                ...product,
                category: product.category?._id || product.category || ''
              });
            }
          }
        }
      } catch (err) {
        showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear specifications if category changes
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value, specifications: {} }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: value
      }
    }));
  };

  const selectedCategoryName = categories.find(c => c._id === formData.category)?.name;

  const uploadToCloudinary = async (file, folder) => {
    try {
      const res = await uploadImage(file, folder);
      if (res && res.success && res.url) return res.url;
      throw new Error('Upload failed');
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (field === 'coverImage') setUploadingCover(true);
    else if (field === 'bannerImage') setUploadingBanner(true);
    
    try {
      const url = await uploadToCloudinary(file, `store/products/${field}`);
      setFormData(prev => ({ ...prev, [field]: url }));
      showSuccess('Image uploaded successfully');
    } catch (err) {
      showError('Image upload failed');
    } finally {
      if (field === 'coverImage') setUploadingCover(false);
      else if (field === 'bannerImage') setUploadingBanner(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploadingGallery(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file, 'store/products/gallery');
        urls.push(url);
      }
      setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...urls] }));
      showSuccess(`Uploaded ${urls.length} gallery images`);
    } catch (err) {
      showError('Failed to upload some images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.salePrice) delete payload.salePrice;
      
      if (isEditMode) {
        await updateProduct(id, payload);
        showSuccess('Product updated successfully');
      } else {
        await createProduct(payload);
        showSuccess('Product created successfully');
      }
      navigate('/store-admin/products');
    } catch (err) {
      showError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link to="/store-admin/products" className="p-2 border rounded-lg hover:bg-zinc-50"><ArrowLeft className="w-5 h-5"/></Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
            <p className="text-sm text-zinc-500">{isEditMode ? `Editing: ${formData.name}` : 'Fill in the details for the new product.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/store-admin/products" className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-50">Cancel</Link>
          <button type="submit" disabled={saving || uploadingCover || uploadingBanner || uploadingGallery} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4"/> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b pb-2">Basic Information</h2>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Premium Layflat Wedding Album" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Short Description *</label>
              <textarea name="shortDescription" required value={formData.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="Brief summary for the product card..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Full Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" rows="6" placeholder="Detailed description for the product page..." />
            </div>
          </div>

          {/* Media Images */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b pb-2">Product Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Cover Image (Card) *</label>
                <div className="border border-dashed p-4 rounded-lg flex flex-col items-center justify-center relative aspect-square bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  {uploadingCover ? <span className="text-sm font-medium">Uploading...</span> : formData.coverImage ? <img src={formData.coverImage} className="w-full h-full object-cover rounded" /> : <div className="text-center"><ImageIcon className="w-8 h-8 text-zinc-300 mx-auto mb-2"/><span className="text-xs font-medium text-zinc-500">Upload Cover Image</span></div>}
                  <input type="file" onChange={(e) => handleImageUpload(e, 'coverImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Banner Image (Detail Hero)</label>
                <div className="border border-dashed p-4 rounded-lg flex flex-col items-center justify-center relative aspect-square bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  {uploadingBanner ? <span className="text-sm font-medium">Uploading...</span> : formData.bannerImage ? <img src={formData.bannerImage} className="w-full h-full object-cover rounded" /> : <div className="text-center"><ImageIcon className="w-8 h-8 text-zinc-300 mx-auto mb-2"/><span className="text-xs font-medium text-zinc-500">Upload Banner Image</span></div>}
                  <input type="file" onChange={(e) => handleImageUpload(e, 'bannerImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Gallery Images ({formData.galleryImages.length})</label>
              <div className="border border-dashed p-6 rounded-lg flex flex-col items-center justify-center relative bg-zinc-50 hover:bg-zinc-100 transition-colors mb-4">
                {uploadingGallery ? <span className="text-sm font-medium">Uploading...</span> : <div className="text-center"><Upload className="w-8 h-8 text-zinc-300 mx-auto mb-2"/><span className="text-sm font-medium text-zinc-600">Select multiple images</span></div>}
                <input type="file" multiple onChange={handleGalleryUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {formData.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded border overflow-hidden">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Dynamic Specifications */}
          {selectedCategoryName && categorySpecificationsConfig[selectedCategoryName] && (
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b pb-2">
                {selectedCategoryName} Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySpecificationsConfig[selectedCategoryName].map((spec) => (
                  <div key={spec.key} className={['coverMaterial', 'minimumOrderQuantity', 'customPhotoSupport', 'customDesignSupport', 'customLogoSupport'].includes(spec.key) ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">{spec.label}</label>
                    <input 
                      type="text" 
                      value={formData.specifications?.[spec.key] || ''} 
                      onChange={(e) => handleSpecChange(spec.key, e.target.value)} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder={spec.placeholder} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Organization */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b pb-2">Organization</h2>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Category *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="" disabled>Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Stock Status</label>
              <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="In Stock">In Stock</option>
                <option value="Out Of Stock">Out Of Stock</option>
                <option value="Pre Order">Pre Order</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="rounded text-[#ea580c] w-4 h-4 focus:ring-[#ea580c]" />
                Product is Active (Visible)
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded text-[#ea580c] w-4 h-4 focus:ring-[#ea580c]" />
                Featured Product
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b pb-2">Pricing (₹)</h2>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Base Price *</label>
              <input type="number" name="basePrice" required min="0" value={formData.basePrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Sale Price</label>
              <input type="number" name="salePrice" min="0" value={formData.salePrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
            </div>
            {formData.basePrice && formData.salePrice && Number(formData.basePrice) > Number(formData.salePrice) && (
              <div className="p-3 bg-green-50 text-green-800 text-sm rounded-lg font-medium border border-green-200">
                Discount: {Math.round(((formData.basePrice - formData.salePrice) / formData.basePrice) * 100)}% OFF
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductEditor;
