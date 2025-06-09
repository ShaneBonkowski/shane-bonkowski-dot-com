"use client";

import React, { useEffect, useState } from "react";

interface GameIconButtonProps {
  onPointerDown: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
  lightModeDark?: boolean;
  darkModeLight?: boolean;
}

const GameIconButton: React.FC<GameIconButtonProps> = ({
  onPointerDown,
  icon,
  ariaLabel,
  className = "",
  lightModeDark = false, // true -> make the light mode be the dark mode colors
  darkModeLight = false, // true -> make the dark mode be the light mode colors
}) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Conditionally build class names
  const lightModeClass = lightModeDark
    ? // dark colors
      "text-primary-text-color active:text-secondary-text-color" +
      (isHoverable ? " hover:text-secondary-text-color" : "")
    : // light colors
      "text-primary-text-color-light active:text-secondary-text-color-light" +
      (isHoverable ? " hover:text-secondary-text-color-light" : "");
  const darkModeClass = darkModeLight
    ? // light colors
      "dark:text-primary-text-color-light dark:active:text-secondary-text-color-light" +
      (isHoverable ? " dark:hover:text-secondary-text-color-light" : "")
    : // dark colors
      "dark:text-primary-text-color dark:active:text-secondary-text-color" +
      (isHoverable ? " dark:hover:text-secondary-text-color" : "");

  return (
    <button
      className={`z-50 pointer-events-auto flex items-center justify-center cursor-pointer ${lightModeClass} ${darkModeClass} ${className}`}
      onPointerDown={onPointerDown}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export default GameIconButton;
