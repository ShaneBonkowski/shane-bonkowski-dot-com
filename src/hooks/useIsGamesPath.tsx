import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useIsGamesPath = () => {
  const pathname = usePathname();
  const [isGamesPath, setIsGamesPath] = useState(false);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      const handleRouteChange = (url: string) => {
        setIsGamesPath(url.startsWith("/games"));
      };

      // Initial check
      setIsGamesPath(window.location.pathname.startsWith("/games"));

      // Listen for route changes
      handleRouteChange(pathname);
    }
  }, [pathname]);

  return isGamesPath;
};

export default useIsGamesPath;
