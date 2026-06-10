import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Copy, Trash2, Eye, LayoutGrid, List } from 'lucide-react';

// Mock Data
const MOCK_CATEGORIES = [
  { id: 1, name: 'Wedding Photography', count: 4, status: 'Active', lastUpdated: '2025-10-12' },
  { id: 2, name: 'Pre-Wedding Shoots', count: 3, status: 'Active', lastUpdated: '2025-09-28' },
  { id: 3, name: 'Corporate Events', count: 2, status: 'Draft', lastUpdated: '2025-08-15' },
];

const MOCK_PACKAGES = [
  { id: 'pkg_1', name: 'Luxury Wedding Package', category: 'Wedding Photography', price: '$5,000', status: 'Published', featured: true, thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150' },
  { id: 'pkg_2', name: 'Platinum Wedding Package', category: 'Wedding Photography', price: '$3,500', status: 'Published', featured: false, thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=150' },
  { id: 'pkg_3', name: 'Destination Pre-Wedding', category: 'Pre-Wedding Shoots', price: '$2,000', status: 'Draft', featured: false, thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150' },
];

const PackagesDashboard = () => {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'categories'
  const [search, setSearch] = useState('');

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans text-zinc-900 bg-[#fbfbfb] min-h-screen p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Package Management</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage all your photography and videography packages</p>
        </div>
        <div className="flex w-full sm:w-auto">
          {activeTab === 'categories' ? (
            <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md">
              <Plus className="w-5 h-5" /> Create Category
            </button>
          ) : (
            <Link to="/packages/create" className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md">
              <Plus className="w-5 h-5" /> Create New Package
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Tabs & Toolbar Container */}
        <div className="border-b border-zinc-100 bg-zinc-50/50">
          
          {/* Tabs */}
          <div className="flex px-6 pt-4 gap-8 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('packages')}
              className={`pb-4 text-[15px] font-bold transition-all duration-300 relative ${activeTab === 'packages' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Packages <span className="ml-1.5 px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded-full text-xs">{MOCK_PACKAGES.length}</span>
              {activeTab === 'packages' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 rounded-t-full"></div>}
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-4 text-[15px] font-bold transition-all duration-300 relative ${activeTab === 'categories' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Categories <span className="ml-1.5 px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded-full text-xs">{MOCK_CATEGORIES.length}</span>
              {activeTab === 'categories' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 rounded-t-full"></div>}
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
            <div className="w-full sm:max-w-md group">
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5 focus-within:border-zinc-900 transition-all shadow-sm">
                <div className="pl-4 pr-3 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-3 pr-4 bg-transparent text-sm font-medium outline-none text-zinc-900 placeholder-zinc-400"
                />
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-3 bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold rounded-xl hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm transition-all duration-300">
                <Filter className="w-4 h-4 text-zinc-500" /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'packages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Package Details</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Pricing</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {MOCK_PACKAGES.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 shadow-sm shrink-0">
                            <img src={pkg.thumb} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 text-[15px]">{pkg.name}</p>
                            {pkg.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-md text-[10px] font-bold tracking-widest uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-semibold">{pkg.category}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-zinc-900 text-base">{pkg.price}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${pkg.status === 'Published' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pkg.status === 'Published' ? 'bg-[#10b981]' : 'bg-zinc-400'}`}></span>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/packages/${pkg.id}`} className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-xl transition-all duration-300">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-xl transition-all duration-300">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Category Name</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Packages Count</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Last Updated</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {MOCK_CATEGORIES.map((cat) => (
                    <tr key={cat.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-zinc-900 text-[15px]">{cat.name}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-semibold text-zinc-600">{cat.count} Packages</span>
                      </td>
                      <td className="px-8 py-5 text-zinc-500 font-medium">{cat.lastUpdated}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${cat.status === 'Active' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-xl transition-all duration-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 hover:shadow-sm rounded-xl transition-all duration-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesDashboard;
