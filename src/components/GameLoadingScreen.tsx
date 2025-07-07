"use client";

import React, { useEffect, useState } from "react";
import Fade from "@/src/components/Fade";
import GameLogoImageWithBackgroundProps from "@/src/components/GameLogoImageWithBackground";

interface LoadingScreenProps {
  coverImage: string;
  onFadeOutComplete: () => void;
}

const GameLoadingScreen: React.FC<LoadingScreenProps> = ({
  coverImage,
  onFadeOutComplete,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const fadeDuration = 1000; // milliseconds

  useEffect(() => {
    // Animate the dots
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        const trimmed = prev.trim();
        if (trimmed === "...") return ".  ";
        return (trimmed + ".").padEnd(3, " ");
      });
    }, 250);

    const handleCloseLoadingScreen = () => {
      setIsFadingOut(true);
    };

    document.addEventListener("closeLoadingScreen", handleCloseLoadingScreen);

    return () => {
      clearInterval(interval);
      document.removeEventListener(
        "closeLoadingScreen",
        handleCloseLoadingScreen
      );
      setIsFadingOut(false);
    };
  }, [onFadeOutComplete, fadeDuration]);

  return (
    <Fade
      isFading={isFadingOut}
      fadeType="out"
      duration={fadeDuration}
      onFadeComplete={onFadeOutComplete}
      // z-40 so its most of the way in the front.. but behind e.g. the header at z-50.
      className="app-mode fixed z-40 inset-0 flex items-center justify-center bg-black"
      id="game-loading-screen"
      aria-label="Game loading screen"
    >
      {/* Game Logo Image */}
      <GameLogoImageWithBackgroundProps coverImage={coverImage} />

      {/* Loading Text */}
      <p
        className="z-20 absolute text-left m-0 bottom-5 right-5 text-primary-text-color"
        style={{ width: "10ch", textAlign: "left" }} // Fixed width for consistent alignment
        aria-live="polite"
      >
        Loading{loadingDots}
      </p>
    </Fade>
  );
};

export default GameLoadingScreen;
