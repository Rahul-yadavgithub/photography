import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Video, Link as LinkIcon, Star, Check, Trash2 } from 'lucide-react';
import { useReelsApi, useFilmCategoriesApi } from '../../../api/films';
import ImageUploader from '../../../components/shared/ImageUploader';
import VideoUploader from '../../../components/shared/VideoUploader';
import DeleteModal from '../../../components/shared/DeleteModal';
import { useNotification } from '../../../context/NotificationContext';

const ReelEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading: saving, fetchReelById, createReel, updateReel, deleteReel } = useReelsApi();
  const { fetchCategories } = useFilmCategoriesApi();
  const { showSuccess, showError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    source: 'instagram',
    videoUrl: '',
    duration: '',
    category: '',
    status: 'Draft',
    trending: false,
    displayOrder: 1,
    thumbnail: ''
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const cats = await fetchCategories();
      setCategories(cats || []);
      
      if (cats && cats.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: cats[0].name }));
      }

      if (id) {
        const reel = await fetchReelById(id);
        if (reel) {
          setFormData({
            title: reel.title || '',
            source: reel.videoSource || 'instagram',
            videoUrl: reel.videoUrl || '',
            duration: reel.duration || '',
            category: reel.category || '',
            status: reel.status || 'Draft',
            trending: reel.trending || false,
            displayOrder: reel.displayOrder || 1,
            thumbnail: reel.thumbnail || ''
          });
        }
      }
      setLoading(false);
    };
    loadInitialData();
  }, [id, fetchCategories, fetchReelById]);

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        videoSource: formData.source // map to model
      };
      
      if (id) {
        await updateReel(id, dataToSave);
        showSuccess('Reel updated successfully.');
      } else {
        await createReel(dataToSave);
        showSuccess('Reel created successfully.');
      }
      navigate('/films/reels');
    } catch (err) {
      console.error('Failed to save reel:', err);
      showError('Failed to save reel.');
    }
  };

  const confirmDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReel(id);
      showSuccess('Reel deleted successfully.');
      navigate('/films/reels');
    } catch (err) {
      console.error('Failed to delete reel:', err);
      showError('Failed to delete reel.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading editor...</div>;

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-24 font-sans text-zinc-900 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          <Link to="/films/reels" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm hover:shadow">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Upload Reel</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Add a vertical short video to your social highlights.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {id && (
            <button 
              onClick={confirmDelete}
              disabled={saving}
              className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Reel'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Details */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Reel Details</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Reel Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base" 
                  placeholder="e.g. Epic Bride Entry with Cold Pyros" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Duration</label>
                  <input 
                    type="text" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base" 
                    placeholder="e.g. 0:45" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video Source */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-zinc-400" /> Video Source
            </h3>
            
            <div className="flex gap-4 mb-6">
              {['instagram', 'youtube_shorts', 'upload'].map((src) => (
                <button
                  key={src}
                  onClick={() => setFormData({...formData, source: src})}
                  className={`flex-1 py-3 text-sm font-bold capitalize rounded-xl transition-all border-2 ${
                    formData.source === src 
                      ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  {src === 'instagram' ? 'Instagram Reel' : src === 'youtube_shorts' ? 'YouTube Shorts' : 'Direct Upload'}
                </button>
              ))}
            </div>

            {formData.source !== 'upload' ? (
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Video URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="url" 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base" 
                    placeholder={`https://www.${formData.source === 'instagram' ? 'instagram.com/reel' : 'youtube.com/shorts'}/...`} 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <VideoUploader 
                  folder="films/reels"
                  onUploadSuccess={(url) => setFormData({...formData, videoUrl: url})}
                />
                {formData.videoUrl && (
                  <div className="w-full aspect-[9/16] rounded-xl overflow-hidden border border-zinc-200 bg-black max-w-sm mx-auto">
                    <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          
          {/* Vertical Thumbnail */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Vertical Thumbnail</h3>
            <ImageUploader 
              folder="reels"
              onUploadSuccess={(url) => setFormData({...formData, thumbnail: url})}
            />
            {formData.thumbnail && (
              <div className="mt-4 w-full aspect-[9/16] rounded-xl overflow-hidden border border-zinc-200">
                <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Thumbnail Preview" />
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Publishing Status</h3>
            <div className="space-y-3">
              {['Published', 'Draft', 'Archived'].map((status) => (
                <label 
                  key={status} 
                  onClick={() => setFormData({...formData, status})}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.status === status ? 'border-zinc-900 bg-zinc-50' : 'border-transparent hover:bg-zinc-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.status === status ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 bg-white'
                  }`}>
                    {formData.status === status && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`font-bold ${formData.status === status ? 'text-zinc-900' : 'text-zinc-600'}`}>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Display Options</h3>
            
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Star className={`w-5 h-5 ${formData.featured ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <span className="block font-bold text-zinc-900">Featured Reel</span>
                  <span className="block text-xs font-medium text-zinc-500">Pin to top of list</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 shadow-inner"></div>
              </label>
            </div>
            
            <div className="mt-5 space-y-2">
              <label className="text-sm font-bold text-zinc-700">Display Order</label>
              <input 
                type="number" 
                value={formData.displayOrder}
                onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white outline-none transition-all text-zinc-900 font-medium" 
              />
            </div>
          </div>
        </div>

      </div>

      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Reel?"
        message="Are you sure you want to permanently remove this reel? This action cannot be undone."
      />
    </div>
  );
};

export default ReelEditor;
