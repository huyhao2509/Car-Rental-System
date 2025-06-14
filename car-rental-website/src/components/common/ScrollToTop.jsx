// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ autoScrollOnRouteChange = true }) => {
  const location = useLocation();

  // Tự động scroll lên đầu khi chuyển trang
  useEffect(() => {
    if (autoScrollOnRouteChange) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, autoScrollOnRouteChange]);

  return null; // Component này không render gì cả, chỉ có logic
};

export default ScrollToTop;
