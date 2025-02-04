import React from "react";
import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col items-center bg-primary-color p-common-p mt-auto">
      {/* Main Text */}
      <p className="text-center">Thanks for visiting Shanes Games!</p>

      {/* Social Icons */}
      <div className="flex space-x-4 sm:space-x-4 mt-0 mb-0">
        <Link href="/" className="link">
          <div className="text-primary-text-color hover:text-secondary-color cursor-pointer">
            <FaHome size={24} />
          </div>
        </Link>
        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-text-color hover:text-secondary-color"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/shanebonkowski/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-text-color hover:text-secondary-color"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Privacy Policy Link */}
      <Link
        href="/privacy-policy"
        className="link hover:text-secondary-hover-color"
      >
        <p className="text-secondary-text-color hover:text-secondary-hover-color">
          Privacy Policy
        </p>
      </Link>
    </footer>
  );
};

export default Footer;
