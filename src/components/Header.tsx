"use client";

import Link from "next/link";
import Image from "next/image";
import { FaHome, FaGithub, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  /* Only allow hover on hover-supported devices */
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <header
      className="flex justify-between items-center p-common-p sm:p-common-p-sm z-50"
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
            <p className="text-logo-subtitle sm:text-logo-subtitle-sm text-secondary-text-color text-right m-0">
              Black Hole Reject
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section: Navigation Buttons */}
      <nav className="flex space-x-4 sm:space-x-5 h-header-btn-h">
        <Link href="/main/about" className="link">
          <div
            className={`text-primary-text-color ${
              isHoverable ? "hover:text-secondary-text-color" : ""
            } active:text-secondary-text-color cursor-pointer`}
          >
            <FaInfoCircle size={24} />
          </div>
        </Link>

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
      </nav>
    </header>
  );
};

export default Header;
