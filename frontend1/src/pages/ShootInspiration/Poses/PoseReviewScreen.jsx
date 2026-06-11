import React, { useState } from 'react';
import { Camera, Edit2, Trash2, Copy, RefreshCw, Upload, CheckCircle2, Save, X } from 'lucide-react';
import { usePosesApi } from '../../../api/poses';
import { useMediaApi } from '../../../api/media';

const PoseReviewScreen = ({ category, poses, onComplete, onPoseSaved }) => {
  const [reviewPoses, setReviewPoses] = useState(poses);
  const { createPose, generatePoses } = usePosesApi();
  const { uploadImage } = useMediaApi();

  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleUpdateField = (index, field, value) => {
    const updated = [...reviewPoses];
    updated[index] = { ...updated[index], [field]: value };
    setReviewPoses(updated);
  };

  const handleImageUpload = async (index, file) => {
    try {
      setUploadingIndex(index);
      const res = await uploadImage(file, 'poses');
      if (res && res.success) {
        setReviewPoses(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], imageUrl: res.url, imagePublicId: res.public_id };
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to upload image', error);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDelete = (index) => {
    const updated = reviewPoses.filter((_, i) => i !== index);
    setReviewPoses(updated);
    if (updated.length === 0) onComplete();
  };

  const handleDuplicate = (index) => {
    const poseToDuplicate = { ...reviewPoses[index], poseName: reviewPoses[index].poseName + ' (Copy)' };
    const updated = [...reviewPoses];
    updated.splice(index + 1, 0, poseToDuplicate);
    setReviewPoses(updated);
  };

  const handleRegenerate = async (index) => {
    try {
      const res = await generatePoses(category._id, 1);
      if (res.success && res.data && res.data.length > 0) {
        const updated = [...reviewPoses];
        updated[index] = { ...updated[index], ...res.data[0], imageUrl: updated[index].imageUrl };
        setReviewPoses(updated);
      }
    } catch (error) {
      console.error('Failed to regenerate pose', error);
    }
  };

  const handleSave = async (index, status) => {
    setSavingId(index);
    try {
      const poseData = {
        ...reviewPoses[index],
        categoryId: category._id,
        status,
        aiGenerated: true
      };
      const res = await createPose(poseData);
      if (res.success) {
        onPoseSaved(res.data);
        handleDelete(index);
      }
    } catch (error) {
      console.error('Failed to save pose', error);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-zinc-50 overflow-y-auto">
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Review Generated Poses
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">Review, edit, and publish {reviewPoses.length} AI-generated poses for {category.categoryName}</p>
          </div>
          <button onClick={onComplete} className="p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviewPoses.map((pose, index) => {
            const isEditing = editingId === index;

            return (
              <div key={index} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
                {/* Image Section */}
                <div className="w-full md:w-2/5 bg-zinc-100 relative min-h-[300px] border-r border-zinc-100 group">
                  {uploadingIndex === index && (
                    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                       <span className="text-xs font-bold text-zinc-700">Uploading...</span>
                    </div>
                  )}
                  {pose.imageUrl ? (
                    <>
                      <img src={pose.imageUrl} alt={pose.poseName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center">
                        <label className="cursor-pointer bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-zinc-100 transition-colors">
                          <Upload className="w-4 h-4" />
                          Replace Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files[0]) handleImageUpload(index, e.target.files[0]);
                          }} />
                        </label>
                        <button onClick={() => {
                          setReviewPoses(prev => {
                            const updated = [...prev];
                            updated[index] = { ...updated[index], imageUrl: null, imagePublicId: null };
                            return updated;
                          });
                        }} className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Remove Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
                        <Camera className="w-12 h-12 mb-3 opacity-50" />
                        <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Action Shot</span>
                        <span className="text-xs">{pose.poseName}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-zinc-100 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Pose Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files[0]) handleImageUpload(index, e.target.files[0]);
                          }} />
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Content Section */}
                <div className="w-full md:w-3/5 flex flex-col">
                  {isEditing ? (
                    <div className="p-5 flex-grow space-y-4">
                      <input 
                        type="text" 
                        value={pose.poseName} 
                        onChange={(e) => handleUpdateField(index, 'poseName', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <textarea 
                        value={pose.shortDescription} 
                        onChange={(e) => handleUpdateField(index, 'shortDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        rows="2"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Best Time</label>
                          <input type="text" value={pose.bestTime} onChange={(e) => handleUpdateField(index, 'bestTime', e.target.value)} className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-sm outline-none mt-1" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Best Lens</label>
                          <input type="text" value={pose.bestLens} onChange={(e) => handleUpdateField(index, 'bestLens', e.target.value)} className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-sm outline-none mt-1" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Difficulty</label>
                          <select value={pose.difficulty} onChange={(e) => handleUpdateField(index, 'difficulty', e.target.value)} className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-sm outline-none mt-1">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-100">Done Editing</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-zinc-900">{pose.poseName}</h3>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleRegenerate(index)} className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger" title="Regenerate">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(index)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors tooltip-trigger" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDuplicate(index)} className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip-trigger" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(index)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 mb-6 line-clamp-2">{pose.shortDescription}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="w-24 text-xs font-bold uppercase text-zinc-400 tracking-wider">Best Time:</span>
                          <span className="font-medium text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-md">{pose.bestTime}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="w-24 text-xs font-bold uppercase text-zinc-400 tracking-wider">Best Lens:</span>
                          <span className="font-medium text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-md">{pose.bestLens}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="w-24 text-xs font-bold uppercase text-zinc-400 tracking-wider">Difficulty:</span>
                          <span className={`font-medium px-2.5 py-0.5 rounded-md ${
                            pose.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                            pose.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>{pose.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex gap-3 mt-auto">
                    <button 
                      onClick={() => handleSave(index, 'draft')}
                      disabled={savingId === index}
                      className="flex-1 py-2.5 text-zinc-700 bg-white border border-zinc-300 font-bold text-sm rounded-xl hover:bg-zinc-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </button>
                    <button 
                      onClick={() => handleSave(index, 'published')}
                      disabled={savingId === index}
                      className="flex-1 py-2.5 bg-zinc-900 text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Import Sparkles here because it wasn't imported at top
import { Sparkles } from 'lucide-react';

export default PoseReviewScreen;
