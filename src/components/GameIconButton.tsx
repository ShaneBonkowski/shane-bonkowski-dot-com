"use client";

import React, { useEffect, useState } from "react";

interface GameIconButtonProps {
  onPointerDown: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
  lightModeDark?: boolean;
  darkModeLight?: boolean;
  whiteBackground?: boolean;
  blackShadow?: boolean;
  disabled?: boolean;
  title?: string;
}

const GameIconButton: React.FC<GameIconButtonProps> = ({
  onPointerDown,
  icon,
  ariaLabel,
  className = "",
  lightModeDark = false, // true -> make the light mode be the dark mode colors
  darkModeLight = false, // true -> make the dark mode be the light mode colors
  whiteBackground = false, // true -> use a white background for the button
  blackShadow = false, // true -> use a black shadow for the button
  disabled = false, // Whether the button is disabled
  title = undefined, // Optional tooltip text
}) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Conditionally build class names
  const lightModeClass = lightModeDark
    ? // dark colors
      "text-primary-text-color active:text-secondary-text-color disabled:text-secondary-text-color" +
      (isHoverable
        ? " hover:text-secondary-text-color disabled:hover:text-secondary-text-color"
        : "")
    : // light colors
      "text-primary-text-color-light active:text-secondary-text-color-light disabled:text-secondary-text-color-light" +
      (isHoverable
        ? " hover:text-secondary-text-color-light disabled:hover:text-secondary-text-color-light"
        : "");
  const darkModeClass = darkModeLight
    ? // light colors
      "dark:text-primary-text-color-light dark:active:text-secondary-text-color-light dark:disabled:text-secondary-text-color-light" +
      (isHoverable
        ? " dark:hover:text-secondary-text-color-light disabled:dark:hover:text-secondary-text-color-light"
        : "")
    : // dark colors
      "dark:text-primary-text-color dark:active:text-secondary-text-color dark:disabled:text-secondary-text-color" +
      (isHoverable
        ? " dark:hover:text-secondary-text-color disabled:dark:hover:text-secondary-text-color"
        : "");

  return (
    // z-20 so that its behind z-30 windows, but above mostly everything else
    <button
      className={
        (whiteBackground ? "bg-white " : "") +
        `app-mode p-[8px] z-20 pointer-events-auto flex items-center justify-center cursor-pointer 
        disabled:cursor-not-allowed 
        ${lightModeClass} ${darkModeClass} ${className}
        ${blackShadow ? "drop-shadow-black" : ""}`
      }
      onPointerDown={disabled ? undefined : onPointerDown}
      aria-label={ariaLabel}
      disabled={disabled}
      title={title}
    >
      {icon}
    </button>
  );
};

export default GameIconButton;
