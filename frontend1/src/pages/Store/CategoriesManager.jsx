import { useState, useEffect } from 'react';
import { useStoreApi } from '../../api/store';
import { useMediaApi } from '../../api/media';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PREDEFINED_CATEGORIES = [
  'Wedding Album',
  'Wedding Card Printing',
  'Printed Mug',
  'Printed Keychain',
  'Printed Water Bottle',
  'Printed Cap'
];

const CategoriesManager = () => {
  const { getCategories, createCategory, updateCategory, deleteCategory } = useStoreApi();
  const { uploadImage } = useMediaApi();
  const { showSuccess, showError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, categoryId: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', image: '', isActive: true, displayOrder: 0
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name, description: cat.description || '', image: cat.image || '',
        isActive: cat.isActive, displayOrder: cat.displayOrder
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '', isActive: true, displayOrder: 0 });
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file, 'store/categories');
      if (res && res.url) {
        setFormData({ ...formData, image: res.url });
        showSuccess('Image uploaded');
      }
    } catch (err) {
      showError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        showSuccess('Category updated');
      } else {
        await createCategory(formData);
        showSuccess('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showError('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, categoryId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return;
    try {
      await deleteCategory(deleteConfirm.categoryId);
      showSuccess('Category deleted');
      setDeleteConfirm({ show: false, categoryId: null });
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category');
    }
  };

  const availableCategories = PREDEFINED_CATEGORIES.filter(
    name => !categories.some(c => c.name === name) || (editingCategory && editingCategory.name === name)
  );

  if (loading) return <div className="p-8 text-center">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Store Categories</h1>
          <p className="text-sm text-zinc-500">Manage product categories for your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/store-admin/products" className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-700 hover:bg-zinc-50">Manage Products</Link>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4"/> Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-40 bg-zinc-100 relative">
              {cat.image ? <img src={cat.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-zinc-400"><ImageIcon className="w-8 h-8"/></div>}
              {!cat.isActive && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Inactive</div>}
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>
            <div className="p-3 bg-zinc-50 border-t flex justify-end gap-2">
              <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed rounded-xl">No categories found. Create one!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Name</label>
                <select 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="" disabled>Select Predefined Category</option>
                  {availableCategories.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {availableCategories.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 font-medium">All predefined categories have been created.</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Image</label>
                <div className="border border-dashed p-4 rounded flex items-center justify-center relative">
                  {uploading ? <span>Uploading...</span> : formData.image ? <img src={formData.image} className="h-20 object-cover" /> : <span>Click to upload</span>}
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-[#ea580c] focus:ring-[#ea580c]" />
                  Active Status
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-600">Cancel</button>
              <button type="submit" disabled={saving || uploading} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 mb-2">Delete Category?</h3>
              <p className="text-zinc-500 mb-6">
                Are you sure you want to delete this category? This action cannot be undone and may affect products linked to it.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirm({ show: false, categoryId: null })}
                  className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Yes, Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
