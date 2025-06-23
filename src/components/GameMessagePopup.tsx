"use client";

import React, { useState, useEffect, useRef } from "react";

interface GameMessagePopupProps {
  message: string;
  bottom: boolean;
}

const GameMessagePopup: React.FC<GameMessagePopupProps> = ({
  message,
  bottom, // True if place msg on bottom, otherwise it will be placed on top
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants for timing
  const DELAY = 2000; // 2 seconds before showing the message
  const VISIBLE_DURATION = 5000; // Message stays visible for 5 seconds
  const FADE_DURATION = 1000; // NOTE: ensure fade-out duration matches CSS (duration-1000)

  const handleCloseLoadingScreen = () => {
    delayTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);

      timeoutRef.current = setTimeout(() => {
        setIsFading(true);

        fadeTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          setIsFading(false);
        }, FADE_DURATION);
      }, VISIBLE_DURATION);
    }, DELAY);
  };

  useEffect(() => {
    document.addEventListener("closeLoadingScreen", handleCloseLoadingScreen);

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      document.removeEventListener(
        "closeLoadingScreen",
        handleCloseLoadingScreen
      );
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="game-message-popup-container"
      className={`pointer-events-none fixed ${
        bottom ? "bottom-0" : "top-0"
      } flex justify-center w-full transition-opacity duration-1000 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div
        className="bg-game-menu-bkg-color-light dark:bg-game-menu-bkg-color"
        id="game-message-popup-background"
      >
        <p className="w-[65vw] text-center my-0 p-5" aria-live="assertive">
          {message}
        </p>
      </div>
    </div>
  );
};

export default GameMessagePopup;
