import { useApi } from '../hooks/useApi';

export const usePackagesApi = () => {
  const { fetchWithAuth } = useApi();

  const getPackages = () => {
    return fetchWithAuth('/packages');
  };

  const getPackage = (id) => {
    return fetchWithAuth(`/packages/${id}`);
  };

  const createPackage = (data) => {
    return fetchWithAuth('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const updatePackage = (id, data) => {
    return fetchWithAuth(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deletePackage = (id) => {
    return fetchWithAuth(`/packages/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
  };
};
