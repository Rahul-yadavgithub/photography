import React, { useState } from 'react';
import { Save, Image as ImageIcon, Video, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const HeroEditor = () => {
  const [formData, setFormData] = useState({
    mainHeading: 'Cinematic Stories For Your Special Day',
    subHeading: 'Award-winning luxury wedding photography & cinematography studio based in India. We capture moments that last a lifetime.',
    primaryCtaText: 'View Our Packages',
    primaryCtaLink: '/packages',
    secondaryCtaText: 'Watch Our Films',
    secondaryCtaLink: '/films',
    backgroundType: 'Image',
    overlayOpacity: '40',
    alignment: 'center'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Hero Section</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage the first screen visitors see when they land on your website.</p>
        </div>
        <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex gap-8 flex-grow overflow-hidden">
        
        {/* Left Column: Form Controls */}
        <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pb-12 pr-2">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Text Content</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Main Heading</label>
                <input 
                  type="text" 
                  name="mainHeading"
                  value={formData.mainHeading}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Sub Heading</label>
                <textarea 
                  rows="3"
                  name="subHeading"
                  value={formData.subHeading}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Call to Action (CTA) Buttons</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Primary CTA Text</label>
                <input 
                  type="text" 
                  name="primaryCtaText"
                  value={formData.primaryCtaText}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Primary CTA Link</label>
                <input 
                  type="text" 
                  name="primaryCtaLink"
                  value={formData.primaryCtaLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 text-zinc-500 font-mono text-xs" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Secondary CTA Text</label>
                <input 
                  type="text" 
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Secondary CTA Link</label>
                <input 
                  type="text" 
                  name="secondaryCtaLink"
                  value={formData.secondaryCtaLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 text-zinc-500 font-mono text-xs" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Background & Style</h3>
            <div className="space-y-6">
              
              <div>
                <label className="text-sm font-bold text-zinc-700 block mb-2">Background Type</label>
                <div className="flex bg-zinc-100 p-1 rounded-xl mb-4 w-1/2">
                  <button 
                    onClick={() => setFormData({...formData, backgroundType: 'Image'})}
                    className={`flex-1 py-1.5 flex justify-center items-center gap-2 rounded-lg transition-colors font-bold text-xs ${formData.backgroundType === 'Image' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                  ><ImageIcon className="w-4 h-4" /> Image</button>
                  <button 
                    onClick={() => setFormData({...formData, backgroundType: 'Video'})}
                    className={`flex-1 py-1.5 flex justify-center items-center gap-2 rounded-lg transition-colors font-bold text-xs ${formData.backgroundType === 'Video' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                  ><Video className="w-4 h-4" /> Video</button>
                </div>

                <label className="text-sm font-bold text-zinc-700 block mb-2">
                  Hero Background {formData.backgroundType}
                </label>
                
                <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center text-zinc-400">
                      {formData.backgroundType === 'Image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-zinc-900 block">Current {formData.backgroundType}</span>
                      <span className="text-xs text-zinc-500">hero-bg-v2.{formData.backgroundType === 'Image' ? 'jpg' : 'mp4'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-xs font-bold px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-700 transition-colors">
                      Replace
                    </button>
                    <button className="text-xs font-bold px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-zinc-700 block mb-2">Overlay Opacity (%)</label>
                  <input 
                    type="range" 
                    name="overlayOpacity"
                    min="0" max="100" 
                    value={formData.overlayOpacity}
                    onChange={handleChange}
                    className="w-full accent-zinc-900" 
                  />
                  <div className="text-xs text-zinc-500 text-right mt-1">{formData.overlayOpacity}%</div>
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-700 block mb-2">Text Alignment</label>
                  <div className="flex bg-zinc-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setFormData({...formData, alignment: 'left'})}
                      className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${formData.alignment === 'left' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                    ><AlignLeft className="w-4 h-4" /></button>
                    <button 
                      onClick={() => setFormData({...formData, alignment: 'center'})}
                      className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${formData.alignment === 'center' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                    ><AlignCenter className="w-4 h-4" /></button>
                    <button 
                      onClick={() => setFormData({...formData, alignment: 'right'})}
                      className={`flex-1 py-1.5 flex justify-center rounded-lg transition-colors ${formData.alignment === 'right' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                    ><AlignRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live Wireframe Preview */}
        <div className="w-1/2 bg-zinc-100 rounded-2xl border-4 border-zinc-800 overflow-hidden relative shadow-2xl h-full flex flex-col">
          <div className="bg-zinc-800 h-6 flex items-center gap-1.5 px-4 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-grow relative bg-zinc-900">
            {/* Simulated background */}
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" alt="Background" className="w-full h-full object-cover opacity-50" />
            
            <div className={`absolute inset-0 bg-black`} style={{ opacity: formData.overlayOpacity / 100 }}></div>
            
            <div className={`absolute inset-0 flex flex-col justify-center p-12 ${
              formData.alignment === 'center' ? 'items-center text-center' : 
              formData.alignment === 'right' ? 'items-end text-right' : 'items-start text-left'
            }`}>
              <h2 className="text-white text-4xl font-black mb-4 max-w-xl leading-tight">{formData.mainHeading || 'Main Heading Here'}</h2>
              <p className="text-white/80 text-sm max-w-lg mb-8">{formData.subHeading || 'Sub heading will appear here.'}</p>
              
              <div className="flex items-center gap-4">
                {formData.primaryCtaText && (
                  <button className="px-6 py-3 bg-white text-zinc-900 font-bold rounded-lg text-sm">{formData.primaryCtaText}</button>
                )}
                {formData.secondaryCtaText && (
                  <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg text-sm">{formData.secondaryCtaText}</button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroEditor;
