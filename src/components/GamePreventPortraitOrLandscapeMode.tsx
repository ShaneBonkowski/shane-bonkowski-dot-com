"use client";

import React, { useEffect, useState } from "react";
import GameLogoImageWithBackground from "@/src/components/GameLogoImageWithBackground";

interface PreventPortraitOrLandscapeModeProps {
  coverImage: string;
  preventMode: "portrait" | "landscape";
}

const GamePreventPortraitOrLandscapeMode: React.FC<
  PreventPortraitOrLandscapeModeProps
> = ({ coverImage, preventMode }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    const checkOrientation = () => {
      // eslint-disable-next-line no-restricted-syntax
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;

      if (preventMode === "portrait") {
        setShouldShow(isPortrait);
      } else if (preventMode === "landscape") {
        setShouldShow(!isPortrait);
      }
    };

    // Check immediately
    checkOrientation();

    // Poll every 100ms for size changes (resize etc. events arent super reliable)
    const interval = setInterval(checkOrientation, 100);

    return () => {
      clearInterval(interval);
    };
  }, [preventMode]);

  if (!shouldShow) {
    return null;
  }

  const warningText =
    preventMode === "portrait"
      ? "This game only supported in landscape mode. Please rotate your device."
      : "This game only supported in portrait mode. Please rotate your device.";

  return (
    <div
      className="app-mode fixed z-40 inset-0 flex items-center justify-center bg-black"
      id="prevent-portrait-landscape-mode"
      aria-label="Prevent Portrait or Landscape Mode"
    >
      {/* Game Logo Image */}
      <GameLogoImageWithBackground coverImage={coverImage} />

      {/* Warning Text */}
      <p className="p-common-p z-20 fixed text-center bottom-5 text-primary-text-color">
        {warningText}
      </p>
    </div>
  );
};

export default GamePreventPortraitOrLandscapeMode;
