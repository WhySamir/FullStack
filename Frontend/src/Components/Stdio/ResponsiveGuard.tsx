import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResponsiveGuard = ({ children }: { children: JSX.Element }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 640;
      setIsSmallScreen(small);
      if (small) {
        navigate("/stdio/notAvailableStdio", { replace: true });
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    if (window.innerWidth < 640) {
      navigate("/stdio/notAvailableStdio", { replace: true });
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  return !isSmallScreen ? children : null;
};

export default ResponsiveGuard;
