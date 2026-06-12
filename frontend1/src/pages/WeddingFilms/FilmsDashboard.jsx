import React, { useState } from 'react';
import { Film, PlaySquare, FolderTree, Eye, ArrowUpRight, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, trend, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-black text-zinc-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
  </div>
);

const FilmsDashboard = () => {
  const [data, setData] = useState({ stats: null, recentUploads: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/films-dashboard`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to load dashboard data.');
        }
      } catch (err) {
        console.error('Error fetching film dashboard data:', err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <div className="bg-zinc-100 animate-pulse h-32 rounded-2xl"></div>
            <div className="bg-zinc-100 animate-pulse h-32 rounded-2xl"></div>
            <div className="bg-zinc-100 animate-pulse h-32 rounded-2xl"></div>
          </>
        ) : (
          <>
            <StatCard title="Signature Films" value={data.stats?.signatureFilms || 0} icon={Film} />
            <StatCard title="Reels & Shorts" value={data.stats?.reelsAndShorts || 0} icon={PlaySquare} />
            <StatCard title="Categories" value={data.stats?.categories || 0} icon={FolderTree} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/films/signature/create" className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all group">
              <span className="font-semibold text-zinc-900">Upload Signature Film</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 text-zinc-900" />
              </div>
            </Link>
            <Link to="/films/reels/create" className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all group">
              <span className="font-semibold text-zinc-900">Upload Reel</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 text-zinc-900" />
              </div>
            </Link>
            <Link to="/films/categories" className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all group">
              <span className="font-semibold text-zinc-900">Manage Categories</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:rotate-90 transition-transform">
                <Settings className="w-4 h-4 text-zinc-900" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Recent Uploads</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 border border-zinc-100 rounded-xl">
                    <div className="w-24 h-16 bg-zinc-100 animate-pulse rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-zinc-100 animate-pulse rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-100 animate-pulse rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data.recentUploads?.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <Film className="w-8 h-8 mb-3 text-zinc-300" />
                <p className="font-medium">No uploads found.</p>
              </div>
            ) : (
              data.recentUploads.map((upload) => (
                <div key={upload._id} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl hover:border-zinc-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                      <img src={upload.thumbnail || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="thumbnail" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 line-clamp-1">{upload.title}</h4>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        Uploaded {formatDistanceToNow(new Date(upload.createdAt), { addSuffix: true })} • {upload.type}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase rounded-full">
                    {upload.status}
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors border border-zinc-200 rounded-xl hover:bg-zinc-50">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmsDashboard;
