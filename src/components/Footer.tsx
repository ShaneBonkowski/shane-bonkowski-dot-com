"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  /* Only allow hover on hover-supported devices */
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <footer className="flex flex-col items-center bg-primary-color p-common-p sm:p-common-p-sm mt-auto">
      {/* Main Text */}
      <p className="text-center">Thanks for visiting Shanes Games!</p>

      {/* Social Icons */}
      <div className="flex space-x-4 mt-0 mb-0">
        <a
          href="https://www.linkedin.com/in/shanebonkowski/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-primary-text-color ${
            isHoverable ? "hover:text-secondary-text-color" : ""
          } active:text-secondary-text-color`}
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-primary-text-color ${
            isHoverable ? "hover:text-secondary-text-color" : ""
          } active:text-secondary-text-color`}
        >
          <FaGithub size={24} />
        </a>
        <Link href="/" className="link">
          <div
            className={`text-primary-text-color ${
              isHoverable ? "hover:text-secondary-text-color" : ""
            } active:text-secondary-text-color cursor-pointer`}
          >
            <FaHome size={24} />
          </div>
        </Link>
      </div>

      {/* Privacy Policy Link */}
      <Link
        href="/main/privacy-policy"
        className={`link text-secondary-text-color ${
          isHoverable && isHovered
            ? "text-secondary-hover-color underline decoration-secondary-hover-color"
            : "no-underline"
        }
      active:text-secondary-hover-color`}
        onPointerEnter={() => isHoverable && setIsHovered(true)}
        onPointerLeave={() => isHoverable && setIsHovered(false)}
      >
        <p
          className={`text-secondary-text-color ${
            isHoverable && isHovered
              ? "text-secondary-hover-color underline decoration-secondary-hover-color"
              : "no-underline"
          }
        active:text-secondary-hover-color`}
        >
          Privacy Policy
        </p>
      </Link>
    </footer>
  );
};

export default Footer;
