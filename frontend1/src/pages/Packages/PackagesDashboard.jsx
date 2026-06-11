import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Copy, Trash2, Eye, LayoutGrid, List, Loader2, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePackagesApi } from '../../api/packages';

const PackagesDashboard = () => {
  const [search, setSearch] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const { getPackages, updatePackage, deletePackage } = usePackagesApi();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ text: message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStatusToggle = async (pkg) => {
    setIsProcessing(true);
    const newStatus = pkg.status === 'Published' ? 'Draft' : 'Published';
    try {
      const data = await updatePackage(pkg._id || pkg.id, { status: newStatus });
      if (data.success) {
        setPackages(prev => prev.map(p => {
          const isMatch = (p._id && p._id === pkg._id) || (p.id && p.id === pkg.id);
          return isMatch ? { ...p, status: newStatus } : p;
        }));
        showToast(`Package successfully ${newStatus === 'Published' ? 'published' : 'unpublished'}!`, 'success');
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('An error occurred while updating status.', 'error');
    } finally {
      setIsProcessing(false);
      setActiveDropdown(null);
    }
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    
    setIsProcessing(true);
    try {
      const data = await deletePackage(packageToDelete);
      if (data.success) {
        setPackages(prev => prev.filter(p => p._id !== packageToDelete && p.id !== packageToDelete));
        showToast('Package deleted successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to delete package', 'error');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      showToast('An error occurred while deleting the package.', 'error');
    } finally {
      setIsProcessing(false);
      setPackageToDelete(null);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans text-zinc-900 bg-[#fbfbfb] min-h-screen p-4 md:p-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="font-semibold tracking-wide text-sm">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Delete Package?</h3>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                Are you sure you want to delete this package? All associated data, including media and pricing configurations, will be permanently removed. This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setPackageToDelete(null)}
                disabled={isProcessing}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isProcessing}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isProcessing ? 'Deleting...' : 'Delete Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Package Management</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage all your photography and videography packages</p>
        </div>
        <div className="flex w-full sm:w-auto">
          <Link to="/packages/create" className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md">
            <Plus className="w-5 h-5" /> Create New Package
          </Link>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar Container */}
        <div className="border-b border-zinc-100 bg-zinc-50/50">
          
          {/* Search & Filter Toolbar */}
          <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border-b border-zinc-200">
            <div className="w-full sm:max-w-md group">
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5 focus-within:border-zinc-900 transition-all shadow-sm">
                <div className="pl-4 pr-3 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search packages..."
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
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                          <Loader2 className="w-8 h-8 animate-spin mb-4 text-zinc-900" />
                          <p className="text-sm font-medium">Loading packages...</p>
                        </div>
                      </td>
                    </tr>
                  ) : packages.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center text-zinc-500 font-medium">
                        No packages found.
                      </td>
                    </tr>
                  ) : packages.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((pkg) => {
                    const fallbackThumb = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=150";
                    const thumbUrl = pkg.media?.thumbnail || fallbackThumb;
                    
                    return (
                      <tr key={pkg._id || pkg.id} className="hover:bg-zinc-50/80 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 shadow-sm shrink-0">
                              <img src={thumbUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-[15px]">{pkg.name}</p>
                              {pkg.isFeatured && (
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
                          <span className="font-bold text-zinc-900 text-base">${pkg.price?.toLocaleString() || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${pkg.status === 'Published' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pkg.status === 'Published' ? 'bg-[#10b981]' : 'bg-zinc-400'}`}></span>
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity relative">
                            <Link to={`/packages/${pkg.slug || pkg._id}`} className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-xl transition-all duration-300">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === pkg._id ? null : pkg._id);
                              }}
                              className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-xl transition-all duration-300"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {/* Premium Dropdown */}
                            {activeDropdown === pkg._id && (
                              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1.5">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleStatusToggle(pkg); }}
                                    disabled={isProcessing}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                                  >
                                    <Globe className="w-4 h-4 text-zinc-400" /> 
                                    {pkg.status === 'Published' ? 'Unpublish' : 'Publish'}
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setPackageToDelete(pkg._id || pkg.id); setActiveDropdown(null); }}
                                    disabled={isProcessing}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" /> Delete Package
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesDashboard;
