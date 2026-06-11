import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategoriesApi } from '../../../api/categories';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCategories } = useCategoriesApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Pose Categories</h2>
          <p className="text-sm text-zinc-500 mt-1">Organize all your pose inspirations into specific categories.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
            />
          </div>
          <Link 
            to="/categories/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Category
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50 text-zinc-500">
          <Camera className="w-10 h-10 mb-4 text-zinc-300" />
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No Categories Found</h3>
          <p className="text-sm">Get started by creating a new pose category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category._id} 
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
            >
              {/* Cover Image Area */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                {category.media?.thumbnail ? (
                  <img 
                    src={category.media.thumbnail} 
                    alt={category.categoryName} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                    category.status === 'Published' || category.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-zinc-500/90 text-white'
                  }`}>
                    {category.status === 'Published' || category.status === 'Active' ? '✅ Active' : category.status}
                  </span>
                </div>
                
                {/* Bottom Content within Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1 shadow-sm line-clamp-1">{category.categoryName}</h3>
                  <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                    <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Manage Poses</span>
                    {category.featured && (
                      <>
                        <span>•</span>
                        <span>Featured</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Area */}
              <div className="p-5 flex-grow flex flex-col">
                <p className="text-sm text-zinc-600 line-clamp-2 flex-grow">{category.shortDescription || 'No description available.'}</p>
                
                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-2">
                  <Link 
                    to={`/shoot/categories/${category._id}/poses`}
                    className="flex-1 py-2.5 bg-zinc-900 text-white text-center text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    View Collection
                  </Link>
                  <Link 
                    to={`/categories/${category._id}`}
                    className="p-2.5 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default CategoriesManager;
