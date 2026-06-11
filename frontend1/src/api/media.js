import { useApi } from '../hooks/useApi';

export const useMediaApi = () => {
  const { fetchWithAuth } = useApi();

  const uploadImage = async (file, folder = 'packages') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return fetchWithAuth('/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return {
    uploadImage,
  };
};
