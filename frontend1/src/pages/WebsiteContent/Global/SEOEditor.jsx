import React, { useState } from 'react';
import { Save, Search, Globe, Image as ImageIcon } from 'lucide-react';
import { initialSEOData } from '../mockCMSData';

const SEOEditor = () => {
  const [formData, setFormData] = useState(initialSEOData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">SEO Settings</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage global search engine optimization and social sharing cards.</p>
        </div>
        <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex gap-8 flex-grow overflow-hidden">
        
        {/* Left Column: Form Controls */}
        <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pb-12 pr-2">
          
          {/* General SEO */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-zinc-400" /> Global Meta Tags
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-zinc-700 flex justify-between mb-2">
                  Website Title
                  <span className={`text-xs ${formData.title.length > 60 ? 'text-red-500' : 'text-zinc-400'}`}>
                    {formData.title.length} / 60
                  </span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all text-zinc-900 ${
                    formData.title.length > 60 ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-zinc-900'
                  }`} 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 flex justify-between mb-2">
                  Meta Description
                  <span className={`text-xs ${formData.description.length > 160 ? 'text-red-500' : 'text-zinc-400'}`}>
                    {formData.description.length} / 160
                  </span>
                </label>
                <textarea 
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all text-zinc-900 resize-none ${
                    formData.description.length > 160 ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-zinc-900'
                  }`} 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Keywords (Comma separated)</label>
                <input 
                  type="text" 
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                />
              </div>
            </div>
          </div>

          {/* Social Open Graph */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-400" /> Social Sharing (Open Graph)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">OG Title</label>
                <input 
                  type="text" 
                  name="ogTitle"
                  value={formData.ogTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">OG Description</label>
                <textarea 
                  rows="3"
                  name="ogDescription"
                  value={formData.ogDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 resize-none" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">OG Image (Used for Facebook, LinkedIn, Twitter, iMessage)</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 flex items-center gap-4 p-4 cursor-pointer hover:border-zinc-500 transition-colors">
                  <div className="w-24 h-12 bg-zinc-200 rounded overflow-hidden">
                    <img src={formData.ogImage} alt="OG" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-zinc-900 block">Change Image</span>
                    <span className="text-xs text-zinc-500">Recommended: 1200 x 630px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Previews */}
        <div className="w-1/2 flex flex-col gap-6">
          
          {/* Google Search Preview */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Google Search Preview</h3>
            <div className="max-w-[600px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center text-xs">Fav</div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-zinc-800 leading-none">Apex Studios</span>
                  <span className="text-[12px] text-zinc-500 leading-none mt-0.5">{formData.canonical}</span>
                </div>
              </div>
              <h4 className="text-[20px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight mb-1">
                {formData.title || 'Please enter a title'}
              </h4>
              <p className="text-[14px] text-[#4d5156] leading-snug">
                {formData.description || 'Please enter a meta description to see how it looks in search results.'}
              </p>
            </div>
          </div>

          {/* Twitter / iMessage Preview */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Social Card Preview</h3>
            <div className="max-w-[400px] border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="h-[210px] bg-zinc-100 border-b border-zinc-200 relative">
                {formData.ogImage ? (
                  <img src={formData.ogImage} alt="OG Card" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-[#f8f9fa]">
                <div className="text-[12px] text-zinc-500 uppercase mb-1">apexstudios.com</div>
                <h4 className="text-[15px] font-bold text-zinc-900 leading-tight mb-1 truncate">{formData.ogTitle}</h4>
                <p className="text-[13px] text-zinc-500 line-clamp-2 leading-snug">{formData.ogDescription}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SEOEditor;
