"use client";

import React, { useEffect, useState } from "react";

interface GameIconButtonProps {
  onPointerDown: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string; // Optional classes for styling
}

const GameIconButton: React.FC<GameIconButtonProps> = ({
  onPointerDown,
  icon,
  ariaLabel,
  className = "",
}) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <button
      className={`z-50 pointer-events-auto flex items-center justify-center text-primary-text-color-light dark:text-primary-text-color ${
        isHoverable
          ? "hover:text-secondary-text-color-light dark:hover:text-secondary-text-color"
          : ""
      } active:text-secondary-text-color-light dark:active:text-secondary-text-color cursor-pointer ${className}`}
      onPointerDown={onPointerDown}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export default GameIconButton;
