import React, { useState } from 'react';
import { Save, Phone, Mail, MapPin, Clock, HeadphonesIcon } from 'lucide-react';
import { initialContactData } from '../mockCMSData';

const ContactEditor = () => {
  const [formData, setFormData] = useState(initialContactData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Contact Information</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage global contact details used across your website and footer.</p>
        </div>
        <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex gap-8 flex-grow overflow-hidden">
        
        {/* Left Column: Form Controls */}
        <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pb-12 pr-2">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Primary Contact</h3>
            <div className="space-y-5">
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Business Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 font-medium" 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 font-medium" 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 font-medium" 
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Location & Hours</h3>
            <div className="space-y-5">
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Office Address</label>
                  <textarea 
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 font-medium resize-none mb-2" 
                  />
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Google Maps Link</label>
                  <input 
                    type="text" 
                    name="googleMaps"
                    value={formData.googleMaps}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-500 font-mono text-xs" 
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Business Hours</label>
                  <input 
                    type="text" 
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 font-medium" 
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live Wireframe Preview */}
        <div className="w-1/2 flex flex-col gap-6">
          
          {/* Contact Page Preview */}
          <div className="bg-white rounded-2xl border-4 border-zinc-800 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-zinc-900 -skew-y-3 origin-top-left -mt-8"></div>
            
            <div className="relative z-10 pt-8">
              <h3 className="text-3xl font-black text-white mb-12">Get in Touch</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <h4 className="font-bold text-zinc-900">Phone & WhatsApp</h4>
                    </div>
                    <p className="text-sm text-zinc-600">{formData.phone}</p>
                    <p className="text-sm text-zinc-600">{formData.whatsapp}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-rose-500" />
                      <h4 className="font-bold text-zinc-900">Email Us</h4>
                    </div>
                    <p className="text-sm text-zinc-600">{formData.email}</p>
                    <p className="text-sm text-zinc-600">{formData.supportContact}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-zinc-900">Visit Studio</h4>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-[200px]">{formData.address}</p>
                    {formData.googleMaps && (
                      <span className="text-xs font-bold text-blue-600 mt-2 block cursor-pointer hover:underline">Get Directions →</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <h4 className="font-bold text-zinc-900">Hours</h4>
                    </div>
                    <p className="text-sm text-zinc-600">{formData.businessHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl mt-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-black text-xl mb-4">Apex Studios</h4>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{formData.address}</p>
                <div className="flex items-center gap-4 text-white">
                  <span className="text-sm border-b border-zinc-700 pb-1">{formData.phone}</span>
                  <span className="text-sm border-b border-zinc-700 pb-1">{formData.email}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactEditor;
