import { useApi } from '../hooks/useApi';

export const usePosesApi = () => {
  const { fetchWithAuth } = useApi();

  const getPosesByCategory = (categoryId) => {
    return fetchWithAuth(`/admin/poses/category/${categoryId}`);
  };

  const generatePoses = (categoryId, count) => {
    return fetchWithAuth('/admin/poses/generate', {
      method: 'POST',
      body: JSON.stringify({ categoryId, count }),
    });
  };

  const createPose = (poseData) => {
    return fetchWithAuth('/admin/poses', {
      method: 'POST',
      body: JSON.stringify(poseData),
    });
  };

  const updatePose = (id, poseData) => {
    return fetchWithAuth(`/admin/poses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(poseData),
    });
  };

  const deletePose = (id) => {
    return fetchWithAuth(`/admin/poses/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getPosesByCategory,
    generatePoses,
    createPose,
    updatePose,
    deletePose
  };
};
