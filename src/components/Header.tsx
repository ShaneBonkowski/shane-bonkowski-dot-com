import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-common-p sm:p-common-p-sm z-50">
      {/* Left Section: Logo & Title */}
      <Link
        href="/"
        passHref
        className="link no-underline hover:no-underline active:no-underline"
      >
        <div className="shanes-games-logo space-x-1 sm:space-x-3">
          <Image
            src="/webps/mars-circle-logo-small.webp"
            alt="Logo"
            width={120}
            height={120}
            className="w-8 h-8 sm:w-14 sm:h-14"
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
      <nav className="flex space-x-2 sm:space-x-4 h-header-btn-h">
        <Link href="/main/about" className="link">
          <button className="header-btn text-small sm:text-small-sm w-auto h-full">
            About
          </button>
        </Link>

        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          <button className="flex items-center justify-center text-small sm:text-small-sm w-auto h-full">
            <FaGithub className="mr-2" /> GitHub
          </button>
        </a>

        <Link href="/" className="link">
          <button className="header-btn text-small sm:text-small-sm w-auto h-full">
            Content
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
