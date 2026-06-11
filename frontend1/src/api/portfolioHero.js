import { useApi } from '../hooks/useApi';

export const usePortfolioHeroApi = () => {
  const { fetchWithAuth } = useApi();

  const getPortfolioHero = () => {
    return fetchWithAuth('/portfolio-hero');
  };

  const savePortfolioHero = (data) => {
    return fetchWithAuth('/portfolio-hero', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const deletePortfolioHero = () => {
    return fetchWithAuth('/portfolio-hero', {
      method: 'DELETE',
    });
  };

  return { getPortfolioHero, savePortfolioHero, deletePortfolioHero };
};
