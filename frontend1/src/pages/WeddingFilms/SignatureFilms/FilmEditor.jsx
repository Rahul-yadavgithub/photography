import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Video, Link as LinkIcon, Star, Check, Trash2 } from 'lucide-react';
import { useFilmsApi, useFilmCategoriesApi } from '../../../api/films';
import ImageUploader from '../../../components/shared/ImageUploader';
import VideoUploader from '../../../components/shared/VideoUploader';
import DeleteModal from '../../../components/shared/DeleteModal';
import { useNotification } from '../../../context/NotificationContext';

const FilmEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading: saving, fetchFilmById, createFilm, updateFilm, deleteFilm } = useFilmsApi();
  const { fetchCategories } = useFilmCategoriesApi();
  const { showSuccess, showError } = useNotification();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    source: 'youtube',
    videoUrl: '',
    duration: '',
    category: '',
    status: 'Draft',
    featured: false,
    displayOrder: 1,
    thumbnail: '',
    thumbnailVideo: '',
    thumbnailType: 'image'
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
        const film = await fetchFilmById(id);
        if (film) {
          setFormData({
            title: film.title || '',
            source: film.videoSource || 'youtube',
            videoUrl: film.videoUrl || '',
            duration: film.duration || '',
            category: film.category || '',
            status: film.status || 'Draft',
            featured: film.featured || false,
            displayOrder: film.displayOrder || 1,
            thumbnail: film.thumbnail || '',
            thumbnailVideo: film.thumbnailVideo || '',
            thumbnailType: film.thumbnailType || 'image'
          });
        }
      }
      setLoading(false);
    };
    loadInitialData();
  }, [id, fetchCategories, fetchFilmById]);

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        videoSource: formData.source // map to model
      };
      
      if (id) {
        await updateFilm(id, dataToSave);
        showSuccess('Film updated successfully.');
      } else {
        await createFilm(dataToSave);
        showSuccess('Film created successfully.');
      }
      navigate('/films/signature');
    } catch (err) {
      console.error('Failed to save film:', err);
      showError('Failed to save film. Please try again.');
    }
  };

  const confirmDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFilm(id);
      showSuccess('Film deleted successfully.');
      navigate('/films/signature');
    } catch (err) {
      console.error('Failed to delete film:', err);
      showError('Failed to delete film. Please try again.');
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
          <Link to="/films/signature" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm hover:shadow">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create Film</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Upload a new signature wedding film to your collection.</p>
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
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Film'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Details */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Film Details</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Film Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-zinc-900 text-base" 
                  placeholder="e.g. Rahul & Priya Wedding Film" 
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
                    placeholder="e.g. 15:30" 
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
              {['youtube', 'vimeo', 'upload'].map((src) => (
                <button
                  key={src}
                  onClick={() => setFormData({...formData, source: src})}
                  className={`flex-1 py-3 text-sm font-bold capitalize rounded-xl transition-all border-2 ${
                    formData.source === src 
                      ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  {src === 'upload' ? 'Direct Upload' : src}
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
                    placeholder="https://www.youtube.com/watch?v=..." 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <VideoUploader 
                  folder="films/videos"
                  onUploadSuccess={(url) => setFormData({...formData, videoUrl: url})}
                />
                {formData.videoUrl && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 bg-black">
                    <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">Custom Thumbnail</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({...formData, thumbnailType: 'image'})}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.thumbnailType === 'image' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                >
                  Image
                </button>
                <button
                  onClick={() => setFormData({...formData, thumbnailType: 'video'})}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.thumbnailType === 'video' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                >
                  Video
                </button>
              </div>
            </div>

            {formData.thumbnailType === 'image' ? (
              <div className="space-y-4">
                <ImageUploader 
                  folder="films"
                  onUploadSuccess={(url) => setFormData({...formData, thumbnail: url})}
                />
                {formData.thumbnail && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 relative">
                    <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Thumbnail Preview" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <VideoUploader 
                  folder="films/thumbnails"
                  onUploadSuccess={(url) => setFormData({...formData, thumbnailVideo: url})}
                />
                <p className="text-xs text-zinc-500">Provide a short, looping mp4 video (no audio).</p>
                {formData.thumbnailVideo && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 relative bg-black">
                    <video src={formData.thumbnailVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
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
                  <span className="block font-bold text-zinc-900">Featured Film</span>
                  <span className="block text-xs font-medium text-zinc-500">Show in featured section</span>
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
                placeholder="1" 
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
        title="Delete Signature Film?"
        message="Are you sure you want to permanently remove this film? This action cannot be undone."
      />
    </div>
  );
};

export default FilmEditor;
