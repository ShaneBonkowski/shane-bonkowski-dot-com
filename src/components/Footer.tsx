"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import useIsGamesPath from "@/src/hooks/useIsGamesPath";

const Footer: React.FC = () => {
  const isGamesPath = useIsGamesPath();

  /* Only allow hover on hover-supported devices */
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    !isGamesPath && (
      <footer
        className="flex flex-col items-center p-common-p sm:p-common-p-sm mt-auto"
        id="footer"
        aria-label="Footer"
      >
        {/* Main Text */}
        <p className="text-center">Thanks for visiting Shanes Games!</p>

        {/* Social Icons */}
        <div
          className="flex space-x-4 mt-0 mb-0"
          aria-label="Social Media Links"
        >
          <a
            href="https://www.linkedin.com/in/shanebonkowski/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-primary-text-color-light dark:text-primary-text-color ${
              isHoverable
                ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                : ""
            } active:text-secondary-text-color-light dark:active:text-secondary-text-color`}
            aria-label="Shane's LinkedIn"
            title="Shane's LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://github.com/ShaneBonkowski"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-primary-text-color-light dark:text-primary-text-color ${
              isHoverable
                ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
                : ""
            } active:text-secondary-text-color-light dark:active:text-secondary-text-color`}
            aria-label="Shane's GitHub"
            title="Shane's GitHub"
          >
            <FaGithub size={24} />
          </a>
          <Link
            href="/"
            className="link"
            aria-label="Shane's Games Home"
            title="Shane's Games Home"
          >
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
        </div>

        {/* Privacy Policy Link */}
        <Link
          href="/main/privacy-policy"
          className={`link text-secondary-text-color-light dark:text-secondary-text-color ${
            isHoverable && isHovered
              ? "underline decoration-inherit"
              : "no-underline"
          } active:underline active:decoration-inherit`}
          onPointerEnter={() => isHoverable && setIsHovered(true)}
          onPointerLeave={() => isHoverable && setIsHovered(false)}
          aria-label="Privacy Policy"
          title="Privacy Policy"
        >
          <p
            className={`text-secondary-text-color-light dark:text-secondary-text-color ${
              isHoverable && isHovered
                ? "underline decoration-inherit"
                : "no-underline"
            } active:underline active:decoration-inherit`}
          >
            Privacy Policy
          </p>
        </Link>
      </footer>
    )
  );
};

export default Footer;
