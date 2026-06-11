const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getAllPublishedPoses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/poses`);
    if (!response.ok) throw new Error('Failed to fetch poses');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching poses:', error);
    return [];
  }
};

export const getPublishedPosesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/poses/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch category poses');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching category poses:', error);
    return [];
  }
};
