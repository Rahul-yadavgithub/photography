const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getPortfolioHero = async () => {
  try {
    const response = await fetch(`${API_URL}/api/portfolio-hero`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching portfolio hero:", error);
    return null;
  }
};
