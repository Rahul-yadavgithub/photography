// Actual API layer for Packages connecting to the backend database

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categories`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/api/categories/${slug}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Category not found");
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};


export const getPackages = async () => {
  try {
    const response = await fetch(`${API_URL}/api/packages`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching packages from API:", error);
    return [];
  }
};

export const getPackageById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/packages/${id}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Package not found");
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw error;
  }
};

export const getCategoriesWithPackages = async () => {
  try {
    // Fetch all packages and categories from live DB
    const [allPackages, allCategories] = await Promise.all([
      getPackages(),
      getCategories()
    ]);
    
    // 1. Filter only published packages
    const publishedPackages = allPackages.filter(pkg => pkg.status === "Published");
    
    // 2. Group packages by category name (case-insensitive)
    const grouped = publishedPackages.reduce((acc, pkg) => {
      const catKey = (pkg.category || '').toLowerCase().trim();
      if (!acc[catKey]) acc[catKey] = [];
      acc[catKey].push(pkg);
      return acc;
    }, {});

    // 3. Map categories and attach their packages
    const categoriesWithPackages = allCategories.map(cat => {
      const catKey = (cat.categoryName || '').toLowerCase().trim();
      const catPackages = grouped[catKey] || [];
      
      // Sort packages: Featured first, then by order, then by newest
      catPackages.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        
        if ((a.order || 0) !== (b.order || 0)) {
          return (a.order || 0) - (b.order || 0);
        }
        
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      // Calculate starting price
      let startingPrice = null;
      if (catPackages.length > 0) {
        const prices = catPackages.map(p => p.price).filter(p => p != null && p > 0);
        if (prices.length > 0) {
          startingPrice = Math.min(...prices);
        }
      }

      return {
        ...cat,
        id: cat.slug,
        name: cat.categoryName,
        description: cat.shortDescription,
        banner: cat.media?.banner || cat.media?.thumbnail || null,
        packages: catPackages,
        startingPrice: startingPrice
      };
    }).filter(cat => cat.packages.length > 0 || cat.featured);

    return categoriesWithPackages;
  } catch (error) {
    console.error("Error getting categories with packages:", error);
    return [];
  }
};
