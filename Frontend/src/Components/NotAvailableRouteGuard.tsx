import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotAvailableStdio from "./NotAvailableStdio"; // adjust path

const NotAvailableRouteGuard = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 640;
      setIsSmallScreen(small);

      if (!small) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    if (window.innerWidth >= 640) {
      navigate("/", { replace: true });
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  return isSmallScreen ? <NotAvailableStdio /> : null;
};

export default NotAvailableRouteGuard;
