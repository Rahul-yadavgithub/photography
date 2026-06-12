import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSEO = ({ title, description, customSeoTitle, customSeoDescription } = {}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Priority 1: Custom SEO Title
    // 2. Priority 2: Provided dynamic title + Default suffix
    // 3. Priority 3: Fallback route parsing
    let finalTitle = customSeoTitle;

    if (!finalTitle) {
      if (title) {
        finalTitle = `${title} | Admin Panel | Shubham Studio`;
      } else {
        finalTitle = 'Admin Panel | Shubham Studio';
      }
    }

    document.title = finalTitle;

    // Handle Meta Description
    let finalDescription = customSeoDescription || description;
    if (finalDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = finalDescription;
    }
  }, [location.pathname, title, description, customSeoTitle, customSeoDescription]);
};

export default useSEO;
