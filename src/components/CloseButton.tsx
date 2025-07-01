"use client";

import React, { useEffect, useState } from "react";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <button
      className={`px-[10px] py-[4px] absolute top-[1.75rem] right-[1.35rem] landscape:top-[2.25rem] landscape:right-[1.9rem] text-3xl font-bold text-primary-text-color-light dark:text-primary-text-color text-outline-light dark:text-outline-dark ${
        isHoverable
          ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
          : ""
      } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer`}
      onPointerDown={onClose}
      aria-label="Close the window"
    >
      X
    </button>
  );
};

export default CloseButton;
