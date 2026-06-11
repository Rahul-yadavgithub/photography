const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getStoreCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/store/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.data; // Assuming your controller sends { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching store categories:', error);
        throw error;
    }
};

export const getStoreProducts = async (categorySlug = null) => {
    try {
        const url = categorySlug 
            ? `${API_URL}/store/products?category=${categorySlug}`
            : `${API_URL}/store/products`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching store products:', error);
        throw error;
    }
};

export const getProductDetails = async (slug) => {
    try {
        const response = await fetch(`${API_URL}/store/products/${slug}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};
