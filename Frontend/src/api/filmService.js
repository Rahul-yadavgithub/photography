const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:8000/api';

// --- FILM CATEGORIES ---
export const getFilmCategories = async () => {
    try {
        const res = await fetch(`${API_URL}/film-categories`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching film categories:', error);
        return [];
    }
};

export const getFilmCategoryBySlug = async (slug) => {
    try {
        const res = await fetch(`${API_URL}/film-categories/${slug}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching film category:', error);
        return null;
    }
};

// --- FILMS ---
export const getFilmsByCategory = async (categoryName) => {
    try {
        const res = await fetch(`${API_URL}/films?category=${encodeURIComponent(categoryName)}&status=Published`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching films by category:', error);
        return [];
    }
};

export const getAllFilms = async () => {
    try {
        const res = await fetch(`${API_URL}/films?status=Published`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching all films:', error);
        return [];
    }
};

// --- REELS ---
export const getReels = async () => {
    try {
        const res = await fetch(`${API_URL}/reels?status=Published`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching reels:', error);
        return [];
    }
};

export const getReelsByCategory = async (categoryName) => {
    try {
        const res = await fetch(`${API_URL}/reels?category=${encodeURIComponent(categoryName)}&status=Published`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching reels by category:', error);
        return [];
    }
};
