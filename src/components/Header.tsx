"use client";

import Link from "next/link";
import Image from "next/image";
import { FaHome, FaGithub, FaInfoCircle, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  /* Only allow hover on hover-supported devices */
  const [isGamesPath, setIsGamesPath] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    setIsGamesPath(pathname.startsWith("/games"));
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
      className={`flex justify-between items-center p-common-p sm:p-common-p-sm z-50 ${
        isGamesPath ? "absolute top-0 left-0 w-full" : ""
      }`}
      id="header"
    >
      {/* Left Section: Logo & Title */}
      <Link
        href="/"
        passHref
        className={`link no-underline ${
          isHoverable ? "hover:no-underline" : ""
        } active:no-underline`}
      >
        <div className="shanes-games-logo space-x-1 sm:space-x-3">
          <Image
            src="/webps/mars-logo-small.webp"
            alt="Logo"
            width={120}
            height={120}
            className="w-9 h-9 sm:w-14 sm:h-14"
          />
          <div>
            <h1 className="text-logo-title sm:text-logo-title-sm text-right m-0">
              SHANES GAMES
            </h1>
            <p className="text-logo-subtitle sm:text-logo-subtitle-sm text-secondary-text-color-light dark:text-secondary-text-color text-right m-0">
              Black Hole Reject
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section: Navigation Buttons */}
      <nav className="flex space-x-4 sm:space-x-5 h-header-btn-h">
        <button
          onClick={toggleDarkMode}
          className={`text-primary-text-color-light dark:text-primary-text-color ${
            isHoverable
              ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
              : ""
          } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </button>

        <Link href="/main/about" className="link">
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
        >
          <FaGithub size={24} />
        </a>

        <Link href="/" className="link">
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
    </header>
  );
};

export default Header;
