import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 text-text-color">
      {/* Left Section: Logo & Title */}
      <Link href="/" passHref>
        <div className="flex items-center space-x-3 cursor-pointer transform transition-transform duration-0 hover:scale-105">
          <Image
            src="/webps/mars-circle-logo-small.webp"
            alt="Logo"
            width={40}
            height={40}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
          <div>
            <h1 className="text-header-2 font-bold">Shanes Games</h1>
            <p className="text-caption">Black Hole Reject</p>
          </div>
        </div>
      </Link>

      {/* Right Section: Navigation Buttons */}
      <nav className="flex space-x-2 sm:space-x-4">
        <Link href="/about">
          <button className="px-3 py-1 sm:px-4 sm:py-2 bg-button-color rounded hover:bg-secondary-color text-small sm:text-body">
            About Me
          </button>
        </Link>

        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-button-color rounded hover:bg-secondary-color text-small sm:text-body"
        >
          <FaGithub className="mr-2" /> GitHub
        </a>

        <Link href="/">
          <button className="px-3 py-1 sm:px-4 sm:py-2 bg-button-color rounded hover:bg-secondary-color text-small sm:text-body">
            Content
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
