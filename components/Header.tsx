import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-common-padding">
      {/* Left Section: Logo & Title */}
      <Link href="/" passHref className="link no-underline hover:no-underline">
        <div className="shanes-games-logo">
          <Image
            src="/webps/mars-circle-logo-small.webp"
            alt="Logo"
            width={40}
            height={40}
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <div>
            <h1 className="text-header-2 text-right m-0">SHANES GAMES</h1>
            <p className="text-text-secondary-color text-right m-0">
              Black Hole Reject
            </p>
          </div>
        </div>
      </Link>

      {/* Right Section: Navigation Buttons */}
      <nav className="flex space-x-2 sm:space-x-4">
        <Link href="/about" className="link">
          <button className="header-btn">About Me</button>
        </Link>

        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center header-btn"
        >
          <FaGithub className="mr-2" /> GitHub
        </a>

        <Link href="/" className="link">
          <button className="header-btn">Content</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
