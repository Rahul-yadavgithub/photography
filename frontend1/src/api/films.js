import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:8000/api';

// --- FILM CATEGORIES ---
export const useFilmCategoriesApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/film-categories`);
      if (!res.ok) throw new Error('Failed to fetch film categories');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/film-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!res.ok) throw new Error('Failed to create film category');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/film-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!res.ok) throw new Error('Failed to update film category');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/film-categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete film category');
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
};

// --- FILMS ---
export const useFilmsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilms = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/films?${query}`);
      if (!res.ok) throw new Error('Failed to fetch films');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilmById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/films/${id}`);
      if (!res.ok) throw new Error('Failed to fetch film');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFilm = async (filmData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/films`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filmData),
      });
      if (!res.ok) throw new Error('Failed to create film');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilm = async (id, filmData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/films/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filmData),
      });
      if (!res.ok) throw new Error('Failed to update film');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFilm = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/films/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete film');
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchFilms, fetchFilmById, createFilm, updateFilm, deleteFilm };
};

// --- REELS ---
export const useReelsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReels = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/reels?${query}`);
      if (!res.ok) throw new Error('Failed to fetch reels');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReelById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reels/${id}`);
      if (!res.ok) throw new Error('Failed to fetch reel');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReel = async (reelData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reelData),
      });
      if (!res.ok) throw new Error('Failed to create reel');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReel = async (id, reelData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reelData),
      });
      if (!res.ok) throw new Error('Failed to update reel');
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReel = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reels/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete reel');
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchReels, fetchReelById, createReel, updateReel, deleteReel };
};
