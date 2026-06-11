import { useApi } from '../hooks/useApi';

export const usePortfolioApi = () => {
  const { fetchWithAuth } = useApi();

  const getPortfolioAdmin = () => {
    return fetchWithAuth('/admin/portfolio');
  };

  const updateHeroSection = (data) => {
    return fetchWithAuth('/admin/portfolio/hero', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const updateDescriptionSection = (data) => {
    return fetchWithAuth('/admin/portfolio/description', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const addAchievement = (data) => {
    return fetchWithAuth('/admin/portfolio/achievement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const updateAchievement = (id, data) => {
    return fetchWithAuth(`/admin/portfolio/achievement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deleteAchievement = (id) => {
    return fetchWithAuth(`/admin/portfolio/achievement/${id}`, {
      method: 'DELETE',
    });
  };

  const addCollection = (data) => {
    return fetchWithAuth('/admin/portfolio/collection', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const updateCollection = (id, data) => {
    return fetchWithAuth(`/admin/portfolio/collection/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deleteCollection = (id) => {
    return fetchWithAuth(`/admin/portfolio/collection/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getPortfolioAdmin,
    updateHeroSection,
    updateDescriptionSection,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addCollection,
    updateCollection,
    deleteCollection,
  };
};
