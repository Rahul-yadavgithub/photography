import React from 'react';
import ImageUploader from './ImageUploader';
import GalleryUploader from './GalleryUploader';

const MediaManager = ({ media, setMedia }) => {
  // Mock image URLs for demo purposes
  const MOCK_IMG = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800";
  const MOCK_BANNER = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1920";

  const handleUploadThumb = () => setMedia({ ...media, thumbnail: MOCK_IMG });
  const handleDeleteThumb = () => setMedia({ ...media, thumbnail: null });

  const handleUploadBanner = () => setMedia({ ...media, banner: MOCK_BANNER });
  const handleDeleteBanner = () => setMedia({ ...media, banner: null });

  const handleUploadGallery = () => setMedia({ ...media, gallery: [...media.gallery, MOCK_IMG] });
  const handleDeleteGalleryItem = (idx) => setMedia({ ...media, gallery: media.gallery.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-zinc-100 pb-5">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Media Management</h2>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Control the visual assets associated with this package.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageUploader 
          label="Package Thumbnail" 
          description="Used in package cards and search results." 
          recommendedSize="1200 × 1200"
          image={media.thumbnail}
          onUpload={handleUploadThumb}
          onDelete={handleDeleteThumb}
        />
        <ImageUploader 
          label="Hero Banner" 
          description="Displayed at the top of the package detail page." 
          recommendedSize="1920 × 1080"
          image={media.banner}
          onUpload={handleUploadBanner}
          onDelete={handleDeleteBanner}
        />
      </div>

      <GalleryUploader 
        images={media.gallery}
        onUpload={handleUploadGallery}
        onDelete={handleDeleteGalleryItem}
        onReorder={() => {}} // Mock reorder
      />

      {/* Highlight Video Form */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h4 className="text-lg font-bold text-zinc-900 mb-1">Highlight Video</h4>
        <p className="text-sm text-zinc-500 mb-4">Link a cinematic video to display on the package page.</p>
        <div className="flex gap-4">
          <input type="text" placeholder="https://youtube.com/..." className="flex-grow px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" />
          <button className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md">Add Video</button>
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
