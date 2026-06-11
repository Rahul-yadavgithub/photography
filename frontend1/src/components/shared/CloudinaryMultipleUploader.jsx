import { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const CloudinaryMultipleUploader = ({ onUploadSuccess, currentUrls = [], folder = 'uploads' }) => {
  const [urls, setUrls] = useState(currentUrls || []);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (currentUrls && currentUrls.length > 0 && urls.length === 0) {
      setUrls(currentUrls);
    }
  }, [currentUrls]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');
    return data.url;
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    
    setIsUploading(true);
    
    try {
      const uploadPromises = fileArray.map(file => uploadFile(file));
      const newUrls = await Promise.all(uploadPromises);
      
      const updatedUrls = [...urls, ...newUrls];
      setUrls(updatedUrls);
      if (onUploadSuccess) onUploadSuccess(updatedUrls);
      showSuccess(`Successfully uploaded ${newUrls.length} image(s).`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      showError('Failed to upload some images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (indexToRemove) => {
    // Optionally delete from Cloudinary here via backend call
    const newUrls = urls.filter((_, idx) => idx !== indexToRemove);
    setUrls(newUrls);
    if (onUploadSuccess) onUploadSuccess(newUrls);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {urls.map((url, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-zinc-50 flex items-center justify-center">
              <img 
                src={url} 
                alt={`Upload ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(index); }}
                  className="bg-white text-zinc-900 p-2 rounded-full flex items-center gap-2 hover:bg-zinc-100 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {isUploading && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!isUploading && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
            ${isDragging ? 'border-zinc-900 bg-zinc-900/5' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100/50'}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-500">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-700">Click to upload or drag and drop multiple images</p>
            <p className="text-xs text-zinc-500 mt-1">High-quality JPG, PNG, or WebP</p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default CloudinaryMultipleUploader;
