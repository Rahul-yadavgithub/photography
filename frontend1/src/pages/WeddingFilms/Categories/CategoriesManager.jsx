import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Video, ArrowLeft, PlaySquare, Star, Eye, FolderTree } from 'lucide-react';
import { useFilmCategoriesApi } from '../../../api/films';
import ImageUploader from '../../../components/shared/ImageUploader';
import CloudinaryMultipleUploader from '../../../components/shared/CloudinaryMultipleUploader';
import DeleteModal from '../../../components/shared/DeleteModal';
import { useNotification } from '../../../context/NotificationContext';

// Mock videos for the "View Videos" state (we'll wire this to real films later)
const mockVideos = [
  { id: 101, title: 'Rahul & Priya Wedding Film', status: 'Published', featured: true, thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300' },
];

const CategoriesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showSuccess, showError } = useNotification();
  
  const { loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useFilmCategoriesApi();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    heroBanners: [],
    btsGallery: [],
    displayOrder: 1,
    status: 'Published'
  });

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data || []);
  };

  useEffect(() => {
    loadCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async () => {
    try {
      if (formData.id) {
        await updateCategory(formData.id, formData);
      } else {
        await createCategory(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', coverImage: '', heroBanners: [], btsGallery: [], displayOrder: 1, status: 'Published' });
      showSuccess('Category saved successfully.');
      loadCategories();
    } catch (error) {
      console.error('Failed to save:', error);
      showError('Failed to save category.');
    }
  };

  const handleEditCategory = (category) => {
    setFormData({
      id: category._id || category.id,
      name: category.name || '',
      description: category.description || '',
      coverImage: category.coverImage || '',
      heroBanners: category.heroBanners || [],
      btsGallery: category.btsGallery || [],
      displayOrder: category.displayOrder || 1,
      status: category.status || 'Published'
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ isOpen: true, categoryId: id });
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal.categoryId) return;
    
    setIsDeleting(true);
    try {
      await deleteCategory(deleteModal.categoryId);
      showSuccess('Category deleted successfully.');
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      showError('Failed to delete category.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  if (selectedCategory) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{selectedCategory.name}</h2>
              <p className="text-sm text-zinc-500 mt-1 font-medium">{selectedCategory.count} Videos Selected</p>
            </div>
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md">
            <Plus className="w-5 h-5" />
            Create Film
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {mockVideos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900">{video.title}</h4>
                      {video.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                      video.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-4 py-2 text-sm font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Manage Categories</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage video collections shown on your website.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Category
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-zinc-200">
            <FolderTree className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-900">No categories found</h3>
            <p className="text-zinc-500 text-sm mt-1">Create your first film category to get started.</p>
          </div>
        ) : categories.map((category) => (
          <div 
            key={category._id || category.id} 
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
          >
            {/* Cover Image Area */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={category.coverImage} 
                alt={category.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  category.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-zinc-500/90 text-white'
                }`}>
                  {category.status === 'Active' ? '✅ Active' : 'Archive'}
                </span>
              </div>
              
              {/* Bottom Content within Image */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1 shadow-sm">{category.name}</h3>
                <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> {category.count} Videos</span>
                  <span>•</span>
                  <span>{category.featured} Featured</span>
                </div>
              </div>
            </div>

            {/* Details Area */}
            <div className="p-5 flex-grow flex flex-col">
              <p className="text-sm text-zinc-600 line-clamp-2 flex-grow">{category.description}</p>
              
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'Just now'}
                </span>

              {/* Action Buttons (Visible on Hover for desktop, always for mobile) */}
              <div className="mt-4 flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => setSelectedCategory(category)}
                  className="flex-1 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  View Videos
                </button>
                <button 
                  onClick={() => handleEditCategory(category)}
                  className="p-2.5 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => confirmDelete(e, category._id || category.id)}
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-xl font-bold text-zinc-900">Create Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                  placeholder="e.g. Cinematic Wedding Stories" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Hero Banners (Slider)</label>
                <CloudinaryMultipleUploader 
                  folder="film-categories/hero"
                  currentUrls={formData.heroBanners}
                  onUploadSuccess={(urls) => setFormData({ ...formData, heroBanners: urls })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Behind The Scenes Gallery</label>
                <CloudinaryMultipleUploader 
                  folder="film-categories/bts"
                  currentUrls={formData.btsGallery}
                  onUploadSuccess={(urls) => setFormData({ ...formData, btsGallery: urls })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">List Thumbnail (Optional)</label>
                <ImageUploader 
                  folder="film-categories"
                  onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
                />
                {formData.coverImage && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-zinc-200">
                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Short Description</label>
                <textarea 
                  rows="2" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 resize-none" 
                  placeholder="Luxury wedding stories captured through cinematic filmmaking."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 appearance-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSaveCategory} disabled={loading} className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
        title="Delete Category?"
        message="Are you sure you want to permanently delete this category? All associated films will lose their category reference."
      />
    </div>
  );
};

export default CategoriesManager;
