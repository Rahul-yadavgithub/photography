import { useApi } from '../hooks/useApi';

export const useStoreApi = () => {
  const { fetchWithAuth } = useApi();

  // Categories
  const getCategories = () => fetchWithAuth('/admin/store/categories');
  const createCategory = (data) => fetchWithAuth('/admin/store/categories', { method: 'POST', body: JSON.stringify(data) });
  const updateCategory = (id, data) => fetchWithAuth(`/admin/store/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  const deleteCategory = (id) => fetchWithAuth(`/admin/store/categories/${id}`, { method: 'DELETE' });

  // Products
  const getProducts = () => fetchWithAuth('/admin/store/products');
  const createProduct = (data) => fetchWithAuth('/admin/store/products', { method: 'POST', body: JSON.stringify(data) });
  const updateProduct = (id, data) => fetchWithAuth(`/admin/store/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  const deleteProduct = (id) => fetchWithAuth(`/admin/store/products/${id}`, { method: 'DELETE' });

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
