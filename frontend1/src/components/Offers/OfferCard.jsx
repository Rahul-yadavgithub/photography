import React from 'react';
import { Edit2, Pause, Play, Trash2, Calendar, Package, Tag } from 'lucide-react';
import SmartBadge from './SmartBadge';

const OfferCard = ({ offer, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col md:flex-row gap-6 items-center group relative overflow-hidden">
      
      {/* Decorative Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ea580c] to-amber-500 rounded-l-2xl"></div>

      {/* Left: Badge Area */}
      <div className="shrink-0 pl-4">
        <SmartBadge type={offer.type} text={offer.badgeText} size="lg" />
      </div>

      {/* Center: Details */}
      <div className="flex-grow flex flex-col md:border-r border-zinc-100 md:pr-6 w-full">
        <h4 className="text-xl font-bold text-zinc-900 mb-1">{offer.title}</h4>
        <p className="text-sm text-zinc-500 mb-3">{offer.description || 'Premium promotional offer for selected packages.'}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-100">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Valid Until: <strong className="text-zinc-700">{offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'No end date'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-100">
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            <span><strong className="text-zinc-700">{offer.applicablePackages?.length || 0}</strong> Packages Attached</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 w-full md:w-32">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${offer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
            {offer.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(offer)} 
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors border border-transparent hover:border-zinc-200" 
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onToggleStatus(offer._id)} 
            className={`p-2 rounded-xl transition-colors border border-transparent ${offer.status === 'Active' ? 'text-zinc-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'}`} 
            title={offer.status === 'Active' ? 'Pause' : 'Activate'}
          >
            {offer.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => onDelete(offer._id)} 
            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200" 
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default OfferCard;
