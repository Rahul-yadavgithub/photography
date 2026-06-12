import { useState, useEffect } from 'react';
import { useStoreApi } from '../../api/store';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, Image as ImageIcon, Star, ShoppingBag, Eye, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductsManager = () => {
  const { getProducts, deleteProduct } = useStoreApi();
  const { showSuccess, showError } = useNotification();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      if (res.success) setProducts(res.data);
    } catch (err) {
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, productId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.productId) return;
    try {
      await deleteProduct(deleteConfirm.productId);
      showSuccess('Product deleted');
      setDeleteConfirm({ show: false, productId: null });
      fetchProducts();
    } catch (err) {
      showError('Failed to delete product');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#ea580c]"/>
            Store Products
          </h1>
          <p className="text-sm text-zinc-500">Manage all your products available in the store.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/store-admin/categories" className="px-4 py-2 border rounded-lg text-sm font-bold text-zinc-700 hover:bg-zinc-50">Manage Categories</Link>
          <Link to="/store-admin/products/create" className="px-4 py-2 bg-[#ea580c] text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4"/> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center overflow-hidden border">
                        {product.coverImage ? <img src={product.coverImage} className="w-full h-full object-cover"/> : <ImageIcon className="w-5 h-5 text-zinc-400"/>}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 flex items-center gap-2">
                          {product.name}
                          {product.isFeatured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>}
                        </div>
                        <div className="text-xs text-zinc-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{product.category?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">₹{product.salePrice || product.basePrice}</div>
                    {product.salePrice && product.basePrice > product.salePrice && <div className="text-xs text-zinc-400 line-through">₹{product.basePrice}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'}`}>{product.isActive ? 'Active' : 'Hidden'}</span>
                      <span className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${product.stockStatus === 'In Stock' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{product.stockStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`/store/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded" title="View on site"><Eye className="w-4 h-4"/></a>
                      <Link to={`/store-admin/products/${product._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit2 className="w-4 h-4"/></Link>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">No products found. Start by adding some albums!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 mb-2">Delete Product?</h3>
              <p className="text-zinc-500 mb-6">
                Are you sure you want to delete this product? This action cannot be undone and it will be permanently removed from your store.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirm({ show: false, productId: null })}
                  className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Yes, Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
