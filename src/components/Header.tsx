"use client";

import Link from "next/link";
import Image from "next/image";
import { FaHome, FaGithub, FaInfoCircle, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import useIsGamesPath from "@/src/hooks/useIsGamesPath";

const Header: React.FC = () => {
  /* Only allow hover on hover-supported devices */
  const isGamesPath = useIsGamesPath();
  const [isHoverable, setIsHoverable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);

    // Check for saved user preference for theme
    const theme = localStorage.getItem("theme");
    // If no preference, assume dark since that's the default
    if (theme === "dark" || !theme) {
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
      }
      setIsDarkMode(true);
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
      }
      setIsDarkMode(false);
    }

    const handleUiMenuOpen = () => setIsButtonVisible(false);
    const handleUiMenuClose = () => setIsButtonVisible(true);
    const handleManualRevealHeader = () => setIsButtonVisible(true);

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    document.addEventListener("manualRevealHeader", handleManualRevealHeader);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "manualRevealHeader",
        handleManualRevealHeader
      );
    };
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const newTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  return (
    <header
      // z-40 so its most of the way in the front.. but behind e.g. the loading screen at z-50.
      className={`z-40 pointer-events-none flex justify-between items-center p-common-p sm:p-common-p-sm ${
        isButtonVisible ? "" : "hidden"
      } ${isGamesPath ? "absolute top-0 left-0 w-full" : ""}`}
      id="header"
      aria-label="Header"
    >
      {/* Left Section: Logo & Title */}
      <Link
        href="/"
        passHref
        className={`link pointer-events-auto no-underline ${
          isHoverable ? "hover:no-underline" : ""
        } active:no-underline`}
        aria-label="Home"
      >
        <div
          className="shanes-games-logo space-x-1 sm:space-x-3"
          aria-label="Logo and title"
        >
          <Image
            src="/webps/mars-logo-small.webp"
            alt="Logo"
            width={120}
            height={120}
            className="w-9 h-9 sm:w-14 sm:h-14"
          />
          <div>
            <h1
              className={`text-logo-title sm:text-logo-title-sm text-right m-0 ${
                isGamesPath ? "text-outline-light dark:text-outline-dark" : ""
              }`}
            >
              SHANES GAMES
            </h1>
            <p
              className={`text-logo-subtitle sm:text-logo-subtitle-sm text-right m-0 ${
                isGamesPath
                  ? "text-outline-light dark:text-outline-dark text-primary-text-color-light dark:text-primary-text-color"
                  : "text-secondary-text-color-light dark:text-secondary-text-color"
              }`}
            >
              Black Hole Reject
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section: Navigation Buttons */}
      {!isGamesPath && (
        <nav
          className="pointer-events-auto flex space-x-4 sm:space-x-5 h-header-btn-h"
          aria-label="Navigation"
        >
          <button
            onPointerDown={toggleDarkMode}
            className={`text-primary-text-color-light dark:text-primary-text-color ${
              isHoverable
                ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                : ""
            } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>

          <Link href="/main/about" className="link" aria-label="About">
            <div
              className={`text-primary-text-color-light dark:text-primary-text-color ${
                isHoverable
                  ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                  : ""
              } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
            >
              <FaInfoCircle size={24} />
            </div>
          </Link>

          <a
            href="https://github.com/ShaneBonkowski"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-primary-text-color-light dark:text-primary-text-color ${
              isHoverable
                ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                : ""
            } active:text-secondary-text-color-light dark:active:text-secondary-text-color`}
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>

          <Link href="/" className="link" aria-label="Home">
            <div
              className={`text-primary-text-color-light dark:text-primary-text-color ${
                isHoverable
                  ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                  : ""
              } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
            >
              <FaHome size={24} />
            </div>
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
