import { useApi } from '../hooks/useApi';

export const useCategoriesApi = () => {
  const { fetchWithAuth } = useApi();

  const getCategories = () => {
    return fetchWithAuth('/categories');
  };

  const getCategory = (id) => {
    return fetchWithAuth(`/categories/${id}`);
  };

  const createCategory = (data) => {
    return fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const updateCategory = (id, data) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deleteCategory = (id) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE',
    });
  };

  const generateCategoryContent = (categoryName) => {
    return fetchWithAuth('/categories/generate', {
      method: 'POST',
      body: JSON.stringify({ categoryName }),
    });
  };

  return {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    generateCategoryContent
  };
};
