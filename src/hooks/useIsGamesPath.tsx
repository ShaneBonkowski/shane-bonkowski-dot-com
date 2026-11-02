"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useIsGamesPath = () => {
  const pathname = usePathname();
  const [isGamesPath, setIsGamesPath] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    const handleRouteChange = (url: string) => {
      const isGameRoute = url.startsWith("/games");
      setIsGamesPath(isGameRoute);
      document.documentElement.classList.toggle(
        "game-page-active",
        isGameRoute,
      );
    };

    // Initial check
    // eslint-disable-next-line no-restricted-syntax
    setIsGamesPath(window.location.pathname.startsWith("/games"));

    // Listen for route changes
    handleRouteChange(pathname);
  }, [pathname]);

  return isGamesPath;
};

export default useIsGamesPath;
