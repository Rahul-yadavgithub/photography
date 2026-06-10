import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Video, Link as LinkIcon, Star, Check } from 'lucide-react';

const FilmEditor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    source: 'youtube',
    videoUrl: '',
    duration: '',
    category: 'Wedding Film',
    status: 'Draft',
    featured: false,
    displayOrder: 1
  });

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-24 font-sans text-zinc-900 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          <Link to="/wedding-films/signature" className="p-2.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm hover:shadow">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create Film</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Upload a new signature wedding film to your collection.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/wedding-films/signature')}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" /> Save Film
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
                    <option>Wedding Film</option>
                    <option>Pre-Wedding Film</option>
                    <option>Engagement Film</option>
                    <option>Destination Wedding</option>
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
              <div className="w-full h-48 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <UploadCloud className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-zinc-900">Click to upload video</span>
                  <p className="text-xs text-zinc-500 mt-1">MP4, WebM up to 500MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Custom Thumbnail</h3>
            <div className="w-full aspect-video border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group">
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="text-center">
                <span className="font-bold text-zinc-900">Upload high-res thumbnail</span>
                <p className="text-xs text-zinc-500 mt-1">1920x1080px recommended</p>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Publishing Status</h3>
            <div className="space-y-3">
              {['Published', 'Draft', 'Archived'].map((status) => (
                <label key={status} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === status ? 'border-zinc-900 bg-zinc-50' : 'border-transparent hover:bg-zinc-50'
                }`}>
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
    </div>
  );
};

export default FilmEditor;
