import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Camera, ArrowLeft, Star, Sparkles, Filter } from 'lucide-react';
import { useCategoriesApi } from '../../../api/categories';
import { usePosesApi } from '../../../api/poses';
import AIPoseGenerationOverlay from '../../../components/Categories/AIPoseGenerationOverlay';
import PoseReviewScreen from './PoseReviewScreen';

const CategoryPosesManager = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);

  // APIs
  const { getCategory } = useCategoriesApi();
  const { getPosesByCategory, generatePoses, deletePose } = usePosesApi();

  // Modals & Overlays
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);
  const [overlayStatus, setOverlayStatus] = useState(null); // 'GENERATING', 'SUCCESS', 'ERROR'
  const [generatedPosesData, setGeneratedPosesData] = useState([]);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, posesRes] = await Promise.all([
        getCategory(categoryId),
        getPosesByCategory(categoryId)
      ]);

      if (categoryRes.success) setCategory(categoryRes.data);
      if (posesRes.success) setPoses(posesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerateModalOpen(false);
    setOverlayStatus('GENERATING');
    try {
      const res = await generatePoses(categoryId, generateCount);
      if (res.success && res.data) {
        setGeneratedPosesData(res.data);
        setOverlayStatus('SUCCESS');
        setTimeout(() => {
          setOverlayStatus(null);
          setShowReviewScreen(true);
        }, 2000);
      } else {
        setOverlayStatus('ERROR');
      }
    } catch (error) {
      console.error('Generation failed', error);
      setOverlayStatus('ERROR');
    }
  };

  const handleDeletePose = async (id) => {
    if (window.confirm("Are you sure you want to delete this pose?")) {
      try {
        await deletePose(id);
        setPoses(poses.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete pose', error);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-zinc-500">Loading category poses...</div>;
  }

  if (!category) {
    return <div className="text-red-500 text-center mt-10">Category not found.</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      
      {/* Overlays */}
      <AIPoseGenerationOverlay 
        isOpen={!!overlayStatus}
        status={overlayStatus}
        onRetry={handleGenerate}
        onDismiss={() => setOverlayStatus(null)}
      />

      {showReviewScreen && (
        <PoseReviewScreen 
          category={category}
          poses={generatedPosesData}
          onComplete={() => setShowReviewScreen(false)}
          onPoseSaved={(newPose) => {
            setPoses(prev => [newPose, ...prev]);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 mt-4">
        <div className="flex items-center gap-5">
          <Link to="/shoot" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{category.categoryName}</h1>
              <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg uppercase tracking-wider">{poses.length} Poses</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium mt-1">Manage and generate poses for this category.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl shadow-sm transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-all border border-indigo-200 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Generate AI Poses
          </button>
        </div>
      </div>

      {/* Existing Poses Grid */}
      {poses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50 text-zinc-500 mt-10">
          <Camera className="w-10 h-10 mb-4 text-zinc-300" />
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No Poses Found</h3>
          <p className="text-sm">Generate some professional AI poses to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poses.map((pose) => (
            <div key={pose._id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white border border-zinc-200">
              <div className="w-full aspect-[4/5] bg-zinc-100 relative overflow-hidden">
                {pose.imageUrl ? (
                  <img src={pose.imageUrl} alt={pose.poseName} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
                    <Camera className="w-12 h-12 mb-3 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Action Shot</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                    pose.status === 'published' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                  }`}>
                    {pose.status}
                  </span>
                  {pose.aiGenerated && (
                    <div className="p-1.5 bg-indigo-500/90 backdrop-blur-md rounded-lg shadow-sm" title="AI Generated">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content - Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md">{pose.poseName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-lg transition-colors border border-white/20 flex items-center justify-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDeletePose(pose._id)} className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white rounded-lg transition-colors border border-red-500/20">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Poses Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Generate Professional Poses
              </h3>
              <button onClick={() => setIsGenerateModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Selected Category</label>
                <div className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 font-medium cursor-not-allowed">
                  {category.categoryName}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Number Of Poses</label>
                <select 
                  value={generateCount} 
                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-900 font-medium"
                >
                  <option value={5}>5 Poses</option>
                  <option value={10}>10 Poses</option>
                  <option value={15}>15 Poses</option>
                  <option value={20}>20 Poses</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsGenerateModalOpen(false)} className="px-5 py-2.5 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={handleGenerate} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate AI Poses
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryPosesManager;
