const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:8000/api';

export const getPortfolio = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
};

export const getPortfolioGallery = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/gallery`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching portfolio gallery:', error);
    return [];
  }
};
