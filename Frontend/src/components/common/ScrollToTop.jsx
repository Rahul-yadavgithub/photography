import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to scroll to top smoothly, fallback to auto
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Instant feels better for route changes than smooth
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
