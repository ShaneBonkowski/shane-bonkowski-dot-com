"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/src/games/game-template/styles/game.css"; // FIXME: UPDATE
import { UseGameData } from "@/src/games/game-template/components/UseGameData"; // FIXME: UPDATE

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { score } = UseGameData();
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const handleScoreChange = () => {
    // Trigger the pulse effect, and remove it after 500ms
    // which is the same duration as the CSS animation
    setIsPulsing(true);
    timeoutRef.current = setTimeout(() => {
      setIsPulsing(false);
    }, 500);
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsUiVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsUiVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    document.addEventListener(
      "scoreChange",
      handleScoreChange as EventListener
    );

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);

      document.removeEventListener(
        "scoreChange",
        handleScoreChange as EventListener
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    // z-20 so that its behind z-30 windows, but above mostly everything else
    <div
      className={`z-20 ${isUiVisible ? "" : "hidden"}`}
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Score Text */}
      <div
        id="score-display-container"
        className="fixed pointer-events-none top-[12vh] landscape:top-5 w-full flex justify-center items-center"
      >
        <p
          id="score-display"
          className={`mt-4 pointer-events-auto font-bold text-5xl sm:6xl ${
            // FIXME: UPDATE "game-template-pulse" to the actual game styling if necc.
            isPulsing ? "game-template-pulse" : ""
          }`}
          aria-live="polite"
        >
          {score}
        </p>
      </div>
    </div>
  );
};

export default UiOverlay;
