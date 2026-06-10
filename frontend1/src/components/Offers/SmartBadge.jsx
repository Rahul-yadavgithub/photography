import React from 'react';
import { Tag, Percent, Gift, Clock, Sparkles, Calendar, Star } from 'lucide-react';

const TYPE_CONFIG = {
  percentage: { icon: Percent, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
  flat: { icon: Tag, color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  addon: { icon: Gift, color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  product: { icon: Star, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  limited: { icon: Clock, color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200' },
  festival: { icon: Calendar, color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  custom: { icon: Sparkles, color: 'text-zinc-700', bg: 'bg-zinc-100', border: 'border-zinc-200' },
};

const SmartBadge = ({ type, text, className = '' }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.custom;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  );
};

export default SmartBadge;
