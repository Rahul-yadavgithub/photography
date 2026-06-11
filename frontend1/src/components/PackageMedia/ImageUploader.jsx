import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { useMediaApi } from '../../api/media';

const ImageUploader = ({ label, description, image, onUpload, onDelete, recommendedSize, folder = 'packages' }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const { uploadImage } = useMediaApi();

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = await uploadImage(file, folder);
      
      if (data.success && data.url) {
        onUpload(data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Check backend connection.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/jpeg, image/png, image/webp" 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h4 className="text-lg font-bold text-zinc-900">{label}</h4>
          <p className="text-sm text-zinc-500">{description}</p>
          <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">{recommendedSize}</p>
        </div>
        {image && !isUploading && (
          <button onClick={onDelete} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>

      {isUploading ? (
        <div className="w-full h-48 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          <span className="text-sm font-bold text-zinc-500">Uploading to Cloudinary...</span>
        </div>
      ) : image ? (
        <div className="relative w-full h-48 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 group">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button onClick={handleClick} className="px-6 py-2.5 bg-white text-zinc-900 text-sm font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleClick} className="w-full h-48 flex flex-col items-center justify-center gap-3 bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100 rounded-xl transition-all text-zinc-500 hover:text-zinc-700 group">
          <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover:shadow group-hover:-translate-y-1 transition-all">
            <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-zinc-600" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-zinc-700">Click to upload or drag & drop</span>
            <span className="block text-xs font-medium text-zinc-400 mt-1">SVG, PNG, JPG or WEBP</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
