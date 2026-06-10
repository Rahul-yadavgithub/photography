import React from 'react';
import { Edit2, Pause, Play, Trash2 } from 'lucide-react';
import SmartBadge from './SmartBadge';

const OfferCard = ({ offer, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-all shadow-sm hover:shadow-md flex flex-col h-full group relative">
      <div className="flex justify-between items-start mb-4">
        <SmartBadge type={offer.type} text={offer.badgeText} />
        
        {/* Actions Menu */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur rounded-lg p-1 border border-zinc-100 shadow-sm">
          <button onClick={() => onEdit(offer)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onToggleStatus(offer.id)} className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title={offer.status === 'Active' ? 'Pause' : 'Activate'}>
            {offer.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(offer.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h4 className="text-lg font-bold text-zinc-900 mb-1">{offer.title}</h4>
      <p className="text-sm text-zinc-500 mb-4 flex-grow">{offer.description || 'No description provided.'}</p>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 mb-4">
        <div>
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Valid Until</span>
          <span className="text-sm font-medium text-zinc-700">{offer.endDate || 'No end date'}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Status</span>
          <span className={`text-sm font-medium ${offer.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {offer.status}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-medium text-zinc-500">
        <span>{offer.packagesAttached} Packages Attached</span>
        <span className="flex gap-3">
          <span>👁 {offer.views || 0}</span>
          <span>⚡ {offer.conversions || 0}</span>
        </span>
      </div>
    </div>
  );
};

export default OfferCard;
