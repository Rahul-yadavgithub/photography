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
        finalTitle = `${title} | Shubham Studio`;
      } else {
        const path = location.pathname;
        if (path === '/') {
          finalTitle = 'Shubham Studio | Premium Wedding Photography';
        } else if (path.includes('/packages')) {
          finalTitle = 'Packages | Shubham Studio';
        } else if (path.includes('/portfolio')) {
          finalTitle = 'Portfolio | Shubham Studio';
        } else if (path.includes('/films')) {
          finalTitle = 'Films | Shubham Studio';
        } else if (path.includes('/store')) {
          finalTitle = 'Photography Store | Shubham Studio';
        } else if (path.includes('/contact')) {
          finalTitle = 'Contact Us | Shubham Studio';
        } else if (path.includes('/dashboard')) {
          finalTitle = 'Dashboard | Shubham Studio';
        } else if (path.includes('/shoot')) {
          finalTitle = 'Inspiration | Shubham Studio';
        } else {
          finalTitle = 'Shubham Studio';
        }
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
