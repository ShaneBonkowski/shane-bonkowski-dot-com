import React from "react";
import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col items-center bg-main-color text-text-color p-4 mt-auto">
      {/* Main Text */}
      <p className="text-center">Thanks for visiting Shane`s Games!</p>

      {/* Social Icons */}
      <div className="flex space-x-4 mt-2 mb-4">
        <Link href="/">
          <div className="text-text-color hover:text-secondary-color cursor-pointer">
            <FaHome size={24} />
          </div>
        </Link>
        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-color hover:text-secondary-color"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/shanebonkowski/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-color hover:text-secondary-color"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Privacy Policy Link */}
      <Link href="/privacy-policy">
        <div className="text-caption sm:text-small text-secondary-color hover:text-hover-color cursor-pointer">
          Privacy Policy
        </div>
      </Link>
    </footer>
  );
};

export default Footer;
