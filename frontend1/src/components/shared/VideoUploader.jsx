import { useState, useRef } from 'react';
import { UploadCloud, X, Video as VideoIcon, Loader2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const VideoUploader = ({ onUploadSuccess, currentVideoUrl = null, folder = 'videos' }) => {
  const [preview, setPreview] = useState(currentVideoUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showSuccess, showError } = useNotification();

  const handleFile = async (file) => {
    if (!file) return;
    
    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      
      if (data.success) {
        setPreview(data.url); // update preview to cloud URL
        if (onUploadSuccess) onUploadSuccess(data.url);
        showSuccess('Video uploaded successfully.');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      showError('Failed to upload video. Please try again.');
      // Revert preview on failure if it was a new upload
      if (preview === objectUrl) {
        setPreview(currentVideoUrl);
      }
    } finally {
      setIsUploading(false);
    }
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearVideo = async () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess('');
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-black flex items-center justify-center">
          <video 
            src={preview} 
            controls
            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
          />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-2 z-10">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium drop-shadow-md">Uploading Video...</span>
            </div>
          )}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearVideo(); }}
                className="pointer-events-auto bg-white text-zinc-900 p-2 rounded-lg flex items-center gap-2 font-medium hover:bg-zinc-100 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" /> Remove Video
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
            ${isDragging ? 'border-accent bg-accent/5' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100/50'}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-500">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-700">Click to upload or drag and drop</p>
            <p className="text-xs text-zinc-500 mt-1">MP4, WebM (max. 100MB)</p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
      />
    </div>
  );
};

export default VideoUploader;
