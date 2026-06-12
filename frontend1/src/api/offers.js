const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const getOffers = async () => {
  const res = await fetch(`${API_URL}/api/offers`);
  if (!res.ok) throw new Error('Failed to fetch offers');
  return res.json();
};

export const getActiveOffers = async () => {
  const res = await fetch(`${API_URL}/api/offers/active`);
  if (!res.ok) throw new Error('Failed to fetch active offers');
  return res.json();
};

export const getOfferById = async (id) => {
  const res = await fetch(`${API_URL}/api/offers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch offer');
  return res.json();
};

export const createOffer = async (offerData) => {
  const res = await fetch(`${API_URL}/api/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData)
  });
  if (!res.ok) throw new Error('Failed to create offer');
  return res.json();
};

export const updateOffer = async (id, offerData) => {
  const res = await fetch(`${API_URL}/api/offers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData)
  });
  if (!res.ok) throw new Error('Failed to update offer');
  return res.json();
};

export const deleteOffer = async (id) => {
  const res = await fetch(`${API_URL}/api/offers/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete offer');
  return res.json();
};

export const toggleOfferStatus = async (id) => {
  const res = await fetch(`${API_URL}/api/offers/${id}/toggle-status`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to toggle status');
  return res.json();
};
