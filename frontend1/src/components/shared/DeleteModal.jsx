import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={!isDeleting ? onClose : undefined} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5 border border-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-zinc-900 mb-2">{title || 'Delete Item?'}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {message || 'Are you sure you want to permanently remove this item? This action cannot be undone.'}
          </p>
        </div>
        
        <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 hover:shadow-lg transition-all shadow-sm hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
        
        {!isDeleting && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
