import React from 'react';
import { UploadCloud, Trash2, GripVertical } from 'lucide-react';

const GalleryUploader = ({ images, onUpload, onDelete, onReorder }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-5 flex justify-between items-end">
        <div>
          <h4 className="text-lg font-bold text-zinc-900">Package Gallery</h4>
          <p className="text-sm text-zinc-500">Showcase the quality of work included in the package.</p>
        </div>
        <span className="text-sm font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">{images.length} Images</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 group">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <button className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur rounded-lg text-white transition-colors cursor-move">
                  <GripVertical className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(idx)} className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur rounded-lg text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={onUpload} className="aspect-square flex flex-col items-center justify-center gap-2 bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100 rounded-xl transition-all text-zinc-400 group">
          <UploadCloud className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          <span className="text-xs font-bold text-zinc-500">Add Image</span>
        </button>
      </div>
    </div>
  );
};

export default GalleryUploader;
