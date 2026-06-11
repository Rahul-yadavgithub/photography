import { useApi } from '../hooks/useApi';

export const useReviewsApi = () => {
  const { fetchWithAuth } = useApi();

  const getReviews = () => {
    return fetchWithAuth('/admin/reviews');
  };

  const approveReview = (reviewId) => {
    return fetchWithAuth(`/admin/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  };

  const rejectReview = (reviewId) => {
    return fetchWithAuth(`/admin/reviews/${reviewId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  };

  const deleteReview = (reviewId) => {
    return fetchWithAuth(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  };

  return {
    getReviews,
    approveReview,
    rejectReview,
    deleteReview,
  };
};
