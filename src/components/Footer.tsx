"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import useIsGamesPath from "@/src/hooks/useIsGamesPath";
import { usePointerHover } from "@/src/components/PointerInputProvider";

const Footer: React.FC = () => {
  const isGamesPath = useIsGamesPath();

  const [isHovered, setIsHovered] = useState(false);
  const isHoverable = usePointerHover();

  return (
    !isGamesPath && (
      <footer
        className="flex flex-col items-center p-common-p sm:p-common-p-sm mt-auto"
        id="footer"
        aria-label="Footer"
      >
        {/* Main Text */}
        <p className="text-center mb-2">Thanks for visiting Shanes Games!</p>
        <p className="text-center mb-2">
          <a
            href="https://follow.it/shane-s-games?leanpub"
            target="_blank"
            rel="noopener noreferrer"
            className={"link"}
          >
            Subscribe
          </a>{" "}
          to never miss a post
        </p>

        {/* Social Icons */}
        <div
          className="flex space-x-1 mt-0 mb-0"
          aria-label="Social Media Links"
        >
          <a
            href="https://www.linkedin.com/in/shanebonkowski/"
            target="_blank"
            rel="noopener noreferrer"
            className={`interactive-control px-[6px] py-[10px] text-primary-text-color-light dark:text-primary-text-color ${
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
            className={`interactive-control px-[6px] py-[10px] text-primary-text-color-light dark:text-primary-text-color ${
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
            className="link interactive-control"
            aria-label="Shane's Games Home"
            title="Shane's Games Home"
          >
            <div
              className={`px-[6px] py-[10px] text-primary-text-color-light dark:text-primary-text-color ${
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
          onPointerEnter={(event) => setIsHovered(event.pointerType !== "touch")}
          onPointerMove={(event) => {
            if (event.pointerType !== "touch") setIsHovered(true);
          }}
          onPointerLeave={() => setIsHovered(false)}
          aria-label="Privacy Policy"
          title="Privacy Policy"
        >
          <p
            className={`mt-1 text-secondary-text-color-light dark:text-secondary-text-color ${
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
