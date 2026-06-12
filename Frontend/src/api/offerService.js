const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const getActiveOffers = async () => {
  try {
    const res = await fetch(`${API_URL}/api/offers/active`);
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
  } catch (error) {
    console.error('Error in getActiveOffers:', error);
    return [];
  }
};
