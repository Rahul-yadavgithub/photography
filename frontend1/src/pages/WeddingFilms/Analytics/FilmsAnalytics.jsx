import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, PlaySquare, Film } from 'lucide-react';

const StatBox = ({ title, value, label, icon: Icon, color }) => (
  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-zinc-900">{value}</h3>
      </div>
    </div>
    <div className="pt-4 border-t border-zinc-100">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
    </div>
  </div>
);

const FilmsAnalytics = () => {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Video Analytics</h2>
        <p className="text-sm text-zinc-500 mt-1">Track the performance of your cinematic content across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatBox 
          title="Most Viewed Film" 
          value="Priya & Rahul" 
          label="12.4k Views this month" 
          icon={Film} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatBox 
          title="Top Performing Reel" 
          value="Epic Bride Entry" 
          label="240.5k Views • 12k Likes" 
          icon={PlaySquare} 
          color="bg-rose-50 text-rose-600" 
        />
        <StatBox 
          title="Most Popular Category" 
          value="Wedding Reels" 
          label="45 Videos • 850k Total Views" 
          icon={TrendingUp} 
          color="bg-emerald-50 text-emerald-600" 
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
          <BarChart3 className="w-10 h-10 text-zinc-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Detailed Analytics Coming Soon</h3>
        <p className="text-zinc-500 max-w-md mx-auto text-sm">Advanced viewer retention graphs, demographic data, and engagement metrics will be available in the upcoming platform update.</p>
      </div>

    </div>
  );
};

export default FilmsAnalytics;
