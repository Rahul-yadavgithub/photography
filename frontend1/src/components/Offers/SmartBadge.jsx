import React from 'react';
import { Tag, Percent, Gift, Clock, Sparkles, Calendar, Star, Camera, Video, Navigation } from 'lucide-react';

const TYPE_CONFIG = {
  'Percentage Discount': { icon: Percent, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
  'Flat Discount': { icon: Tag, color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  'Free Album': { icon: Gift, color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  'Free Reel': { icon: Video, color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  'Free Drone Shoot': { icon: Navigation, color: 'text-cyan-700', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  'Free Extra Hours': { icon: Clock, color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200' },
  'Complimentary Gift': { icon: Gift, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  'Festival Offer': { icon: Calendar, color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  'Limited Time Offer': { icon: Clock, color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  custom: { icon: Sparkles, color: 'text-zinc-700', bg: 'bg-zinc-100', border: 'border-zinc-200' },
};

const SmartBadge = ({ type, text, size = 'sm', className = '' }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.custom;
  const Icon = config.icon;

  const sizeClasses = size === 'lg' 
    ? 'px-4 py-2 text-sm gap-2' 
    : 'px-3 py-1 text-xs gap-1.5';
  
  const iconSize = size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span className={`inline-flex items-center font-bold border rounded-full ${sizeClasses} ${config.bg} ${config.color} ${config.border} ${className}`}>
      <Icon className={iconSize} />
      {text}
    </span>
  );
};

export default SmartBadge;
