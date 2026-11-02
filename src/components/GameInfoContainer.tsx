"use client";

import React, { useState, useEffect, useRef } from "react";
import GameIconButton from "@/src/components/GameIconButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { FaInfoCircle } from "react-icons/fa";
import Fade from "@/src/components/Fade";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";

const GameInfoContainer: React.FC<{
  lightModeDark?: boolean;
  darkModeLight?: boolean;
  whiteBackground?: boolean;
  blackShadow?: boolean;
  children: React.ReactNode;
  onOpen?: () => void;
}> = ({
  lightModeDark = false,
  darkModeLight = false,
  whiteBackground = false,
  blackShadow = false,
  children,
  onOpen,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showTutorialText, setShowTutorialText] = useState(true);
  const tutorialText = "Instructions";
  const tutorialTypingDuration = tutorialText.length * 80;
  const [isTutorialTextVisible, setIsTutorialTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const fadeOutDuration = 500;

  const openInfoWindow = () => {
    if (onOpen) {
      onOpen();
    }

    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(true);

    // no need to show tutorial text anymore since player has clicked the button
    setShowTutorialText(false);
    dispatchMenuEvent("Info", "open");
  };

  const closeInfoWindow = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(false);
    dispatchMenuEvent("Info", "close");
  };

  useEffect(() => {
    const handleUiMenuOpen = () => setIsButtonVisible(false);
    const handleUiMenuClose = () => setIsButtonVisible(true);

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, []);

  useEffect(() => {
    if (!showTutorialText) return;

    setIsTutorialTextVisible(false);
    setFadeOut(false);

    // Start showing the tutorial text only if the button is visible, which occurs
    // after the game has loaded.
    if (isButtonVisible) {
      // Wait a bit before starting the animation
      animationTimeoutRef.current = setTimeout(() => {
        setIsTutorialTextVisible(true);
        animationTimeoutRef.current = setTimeout(() => {
          setFadeOut(true);
        }, tutorialTypingDuration + 2500);
      }, 1000);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [showTutorialText, isButtonVisible, tutorialTypingDuration]);

  return (
    <>
      <div className="app-mode z-20 fixed bottom-3 right-3 flex flex-row items-center gap-2">
        {/* Tutorial text */}
        {showTutorialText && isButtonVisible && isTutorialTextVisible && (
          <Fade
            isFading={fadeOut}
            fadeType="out"
            duration={fadeOutDuration}
            onFadeComplete={() => setShowTutorialText(false)}
            className="game-instructions-banner bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full pointer-events-none"
            aria-live="polite"
          >
            {tutorialText}
          </Fade>
        )}

        {/* Info button */}
        <GameIconButton
          onPointerDown={openInfoWindow}
          icon={<FaInfoCircle size={30} />}
          ariaLabel="Game Information"
          className={`${isButtonVisible ? "" : "hidden"}`}
          lightModeDark={lightModeDark}
          darkModeLight={darkModeLight}
          whiteBackground={whiteBackground}
          blackShadow={blackShadow}
          title="Game Information"
        />
      </div>

      <GameInfoWindow
        isVisible={isVisible}
        onClose={closeInfoWindow}
        aria-label="Game information window"
      >
        {children}
      </GameInfoWindow>
    </>
  );
};

export default GameInfoContainer;
