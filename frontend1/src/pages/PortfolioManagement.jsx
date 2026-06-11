import { useState, useEffect } from 'react';
import { usePortfolioApi } from '../api/portfolio';
import { useMediaApi } from '../api/media';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Save, Upload, Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle } from 'lucide-react';

const PortfolioManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const {
    getPortfolioAdmin,
    updateHeroSection,
    updateDescriptionSection,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addCollection,
    updateCollection,
    deleteCollection
  } = usePortfolioApi();
  const { uploadImage } = useMediaApi();
  const { showSuccess, showError } = useNotification();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hero State
  const [heroForm, setHeroForm] = useState({
    title: '', subtitle: '', description: '', heroImage: '', backgroundImage: '', buttonText: '', buttonLink: ''
  });
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // Description State
  const [descForm, setDescForm] = useState({
    heading: '', shortDescription: '', fullDescription: '', yearsOfExperience: 0, projectsCompleted: 0, happyClients: 0, teamSize: 0
  });

  // Achievements State
  const [achievements, setAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [achievementForm, setAchievementForm] = useState({
    awardName: '', awardDescription: '', awardYear: new Date().getFullYear(), awardOrganization: '', awardImage: '', displayOrder: 0
  });

  // Collections State
  const [collections, setCollections] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionForm, setCollectionForm] = useState({
    title: '', description: '', coverImage: '', images: [], displayOrder: 0
  });
  const [uploadingColImage, setUploadingColImage] = useState(false);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await getPortfolioAdmin();
      if (res.success && res.data) {
        setPortfolio(res.data);
        if (res.data.heroSection) setHeroForm(res.data.heroSection);
        if (res.data.descriptionSection) setDescForm(res.data.descriptionSection);
        setAchievements(res.data.achievements || []);
        setCollections(res.data.collections || []);
      }
    } catch (error) {
      showError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Helpers
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

  // --- Hero Section Handlers ---
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHeroSection(heroForm);
      showSuccess('Hero section updated');
      fetchPortfolio();
    } catch (err) {
      showError('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (type === 'bg') setUploadingBg(true);
      else setUploadingHero(true);
      const url = await uploadToCloudinary(file, 'portfolio/hero');
      if (type === 'bg') setHeroForm({ ...heroForm, backgroundImage: url });
      else setHeroForm({ ...heroForm, heroImage: url });
      showSuccess('Image uploaded successfully');
    } catch (err) {
      showError('Upload failed');
    } finally {
      if (type === 'bg') setUploadingBg(false);
      else setUploadingHero(false);
    }
  };

  // --- Description Section Handlers ---
  const handleDescSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDescriptionSection(descForm);
      showSuccess('Description section updated');
      fetchPortfolio();
    } catch (err) {
      showError('Failed to update description section');
    } finally {
      setSaving(false);
    }
  };

  // --- Achievements Handlers ---
  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement._id, achievementForm);
        showSuccess('Achievement updated');
      } else {
        await addAchievement(achievementForm);
        showSuccess('Achievement added');
      }
      setShowAchievementModal(false);
      fetchPortfolio();
    } catch (err) {
      showError('Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      showSuccess('Achievement deleted');
      fetchPortfolio();
    } catch (err) {
      showError('Failed to delete achievement');
    }
  };

  // --- Collections Handlers ---
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCollection) {
        await updateCollection(editingCollection._id, collectionForm);
        showSuccess('Collection updated');
      } else {
        await addCollection(collectionForm);
        showSuccess('Collection added');
      }
      setShowCollectionModal(false);
      fetchPortfolio();
    } catch (err) {
      showError('Failed to save collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await deleteCollection(id);
      showSuccess('Collection deleted');
      fetchPortfolio();
    } catch (err) {
      showError('Failed to delete collection');
    }
  };

  const handleCollectionImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingColImage(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file, 'portfolio/collections');
        urls.push(url);
      }
      setCollectionForm({ ...collectionForm, images: [...collectionForm.images, ...urls] });
      showSuccess(`Uploaded ${urls.length} images`);
    } catch (err) {
      showError('Failed to upload some images');
    } finally {
      setUploadingColImage(false);
    }
  };

  const handleCollectionCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingColImage(true);
    try {
      const url = await uploadToCloudinary(file, 'portfolio/collections/covers');
      setCollectionForm({ ...collectionForm, coverImage: url });
      showSuccess('Cover image uploaded');
    } catch (err) {
      showError('Upload failed');
    } finally {
      setUploadingColImage(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#ea580c]" />
            Portfolio Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage all sections of your public portfolio page.</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200 w-full overflow-x-auto">
        {[
          { id: 'hero', label: '1. Hero Section' },
          { id: 'desc', label: '2. Description (About)' },
          { id: 'achievements', label: '3. Achievements' },
          { id: 'collections', label: '4. Collections (Gallery)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-1 ${activeTab === tab.id ? 'bg-white shadow-sm text-zinc-900 font-semibold' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT: HERO --- */}
      {activeTab === 'hero' && (
        <form onSubmit={handleHeroSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 border-b pb-4">Hero Section Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Main Title</label>
              <input type="text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Subtitle</label>
              <input type="text" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Description</label>
              <textarea value={heroForm.description || ''} onChange={e => setHeroForm({...heroForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Button Text</label>
              <input type="text" value={heroForm.buttonText} onChange={e => setHeroForm({...heroForm, buttonText: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Button Link</label>
              <input type="text" value={heroForm.buttonLink} onChange={e => setHeroForm({...heroForm, buttonLink: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            
            {/* Background Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Background Image</label>
              <div className="border border-dashed p-4 rounded flex flex-col items-center justify-center relative">
                {uploadingBg ? <span>Uploading...</span> : heroForm.backgroundImage ? <img src={heroForm.backgroundImage} className="h-32 object-cover rounded" /> : <span>No Image</span>}
                <input type="file" onChange={e => handleHeroImageUpload(e, 'bg')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            
            {/* Hero Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Hero Subject/Foreground Image</label>
              <div className="border border-dashed p-4 rounded flex flex-col items-center justify-center relative bg-zinc-100">
                {uploadingHero ? <span>Uploading...</span> : heroForm.heroImage ? <img src={heroForm.heroImage} className="h-32 object-contain rounded" /> : <span>No Image</span>}
                <input type="file" onChange={e => handleHeroImageUpload(e, 'fg')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">
              <Save className="w-4 h-4"/> {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        </form>
      )}

      {/* --- TAB CONTENT: DESCRIPTION --- */}
      {activeTab === 'desc' && (
        <form onSubmit={handleDescSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 border-b pb-4">About / Description Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Heading</label>
              <input type="text" value={descForm.heading} onChange={e => setDescForm({...descForm, heading: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Full Description</label>
              <textarea value={descForm.fullDescription} onChange={e => setDescForm({...descForm, fullDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="4" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Years of Experience</label>
              <input type="number" value={descForm.yearsOfExperience} onChange={e => setDescForm({...descForm, yearsOfExperience: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Projects Completed</label>
              <input type="number" value={descForm.projectsCompleted} onChange={e => setDescForm({...descForm, projectsCompleted: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Happy Clients</label>
              <input type="number" value={descForm.happyClients} onChange={e => setDescForm({...descForm, happyClients: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Team Size</label>
              <input type="number" value={descForm.teamSize} onChange={e => setDescForm({...descForm, teamSize: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">
              <Save className="w-4 h-4"/> {saving ? 'Saving...' : 'Save Description'}
            </button>
          </div>
        </form>
      )}

      {/* --- TAB CONTENT: ACHIEVEMENTS --- */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-zinc-900">Manage Achievements</h2>
            <button onClick={() => { setEditingAchievement(null); setAchievementForm({awardName: '', awardDescription: '', awardYear: 2024, awardOrganization: '', displayOrder: 0}); setShowAchievementModal(true); }} className="px-4 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold flex items-center gap-2">
              <Plus className="w-4 h-4"/> Add Achievement
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div key={ach._id} className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-[#ea580c] font-bold text-xs bg-orange-50 px-2 py-1 rounded">{ach.awardYear}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingAchievement(ach); setAchievementForm(ach); setShowAchievementModal(true); }} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteAchievement(ach._id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{ach.awardName}</h3>
                <p className="text-sm text-zinc-500 mb-2 font-medium">{ach.awardOrganization}</p>
                <p className="text-sm text-zinc-600 italic line-clamp-3">{ach.awardDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: COLLECTIONS --- */}
      {activeTab === 'collections' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Manage Collections (Gallery)</h2>
              <p className="text-sm text-zinc-500">These images also appear on the homepage gallery.</p>
            </div>
            <button onClick={() => { setEditingCollection(null); setCollectionForm({title: '', description: '', coverImage: '', images: [], displayOrder: 0}); setShowCollectionModal(true); }} className="px-4 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold flex items-center gap-2">
              <Plus className="w-4 h-4"/> Add Collection
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map(col => (
              <div key={col._id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="h-48 w-full bg-zinc-100 relative">
                  {col.coverImage ? <img src={col.coverImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-zinc-400">No Cover</div>}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">{col.images?.length || 0} Images</div>
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-lg mb-1">{col.title}</h3>
                  <p className="text-sm text-zinc-600 line-clamp-2">{col.description}</p>
                </div>
                <div className="p-4 border-t border-zinc-100 flex justify-end gap-2 bg-zinc-50">
                  <button onClick={() => { setEditingCollection(col); setCollectionForm(col); setShowCollectionModal(true); }} className="px-3 py-1.5 text-xs font-bold border border-zinc-300 rounded hover:bg-zinc-100 flex items-center gap-1"><Edit2 className="w-3.5 h-3.5"/> Edit</button>
                  <button onClick={() => handleDeleteCollection(col._id)} className="px-3 py-1.5 text-xs font-bold border border-red-200 text-red-600 rounded hover:bg-red-50 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleAchievementSubmit} className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Award Name</label>
                <input type="text" required value={achievementForm.awardName} onChange={e => setAchievementForm({...achievementForm, awardName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Organization</label>
                <input type="text" value={achievementForm.awardOrganization} onChange={e => setAchievementForm({...achievementForm, awardOrganization: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Year</label>
                <input type="number" required value={achievementForm.awardYear} onChange={e => setAchievementForm({...achievementForm, awardYear: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Description</label>
                <textarea value={achievementForm.awardDescription} onChange={e => setAchievementForm({...achievementForm, awardDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowAchievementModal(false)} className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editingCollection ? 'Edit Collection' : 'Add Collection'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Title</label>
                  <input type="text" required value={collectionForm.title} onChange={e => setCollectionForm({...collectionForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Description</label>
                  <textarea value={collectionForm.description} onChange={e => setCollectionForm({...collectionForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Cover Image</label>
                  <div className="border border-dashed p-4 rounded relative">
                    {uploadingColImage ? <span>Uploading...</span> : collectionForm.coverImage ? <img src={collectionForm.coverImage} className="h-24 object-cover" /> : <span>Upload Cover</span>}
                    <input type="file" onChange={handleCollectionCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 border-l pl-6">
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Gallery Images ({collectionForm.images.length})</label>
                <div className="border border-dashed p-4 rounded flex justify-center relative bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors">
                  <div className="text-center pointer-events-none flex flex-col items-center">
                     <Upload className="w-6 h-6 text-[#ea580c] mb-2"/>
                     <span className="text-sm font-bold text-[#ea580c]">Upload Multiple Images</span>
                  </div>
                  <input type="file" multiple onChange={handleCollectionImagesUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 max-h-[200px] overflow-y-auto pr-2">
                  {collectionForm.images.map((img, i) => (
                    <div key={i} className="relative group rounded overflow-hidden aspect-square border">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setCollectionForm({...collectionForm, images: collectionForm.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button type="button" onClick={() => setShowCollectionModal(false)} className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-600">Cancel</button>
              <button onClick={handleCollectionSubmit} disabled={saving || uploadingColImage} className="px-6 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2"><Save className="w-4 h-4"/> Save Collection</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PortfolioManagement;
