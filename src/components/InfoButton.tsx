"use client";

import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <button
      className={`fixed bottom-4 right-4 flex items-center justify-center text-primary-text-color-light dark:text-primary-text-color ${
        isHoverable
          ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
          : ""
      } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
      id="info-button"
      onClick={onClick}
    >
      <FaInfoCircle size={24} />
      <span className="sr-only">Info</span>
    </button>
  );
};

export default InfoButton;
