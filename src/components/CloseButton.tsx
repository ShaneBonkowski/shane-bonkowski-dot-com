"use client";

import React, { useEffect, useState } from "react";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <button
      className={`absolute top-5 right-5 text-lg font-bold text-primary-text-color-light dark:text-primary-text-color ${
        isHoverable
          ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
          : ""
      } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
      onPointerDown={onClose}
      aria-label="Close"
    >
      X
    </button>
  );
};

export default CloseButton;
