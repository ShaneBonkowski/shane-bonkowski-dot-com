"use client";

import React, { useState, useEffect, useRef } from "react";
import GameIconButton from "@/src/components/GameIconButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { FaInfoCircle } from "react-icons/fa";
import Fade from "@/src/components/Fade";

const GameInfoContainer: React.FC<{
  lightModeDark?: boolean;
  darkModeLight?: boolean;
  whiteBackground?: boolean;
  children: React.ReactNode;
  onOpenPreDelay?: () => void;
  onOpenPostDelay?: () => void;
}> = ({
  lightModeDark = false,
  darkModeLight = false,
  whiteBackground = false,
  children,
  onOpenPreDelay,
  onOpenPostDelay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showTutorialText, setShowTutorialText] = useState(true);
  const [animatedTutorialText, setAnimatedTutorialText] = useState("");
  const tutorialText = "Instructions";
  const [fadeOut, setFadeOut] = useState(false);
  const fadeOutDuration = 500;

  const openInfoWindow = () => {
    if (onOpenPreDelay) {
      onOpenPreDelay();
    }

    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      if (onOpenPostDelay) {
        onOpenPostDelay();
      }

      setIsVisible(true);
      // no need to show tutorial text anymore since player has clicked the button
      setShowTutorialText(false);
      dispatchMenuEvent("Info", "open");
    }, 150);
  };

  const closeInfoWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      dispatchMenuEvent("Info", "close");
    }, 150);
  };

  useEffect(() => {
    const handleUiMenuOpen = () => setIsButtonVisible(false);
    const handleUiMenuClose = () => setIsButtonVisible(true);

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!showTutorialText) return;

    let i = 0;
    setAnimatedTutorialText("");
    setFadeOut(false);

    // Start showing the tutorial text only if the button is visible, which occurs
    // after the game has loaded.
    if (isButtonVisible) {
      // Wait a bit before starting the animation
      animationTimeoutRef.current = setTimeout(() => {
        // Start typing animation for the tutorial text
        intervalRef.current = setInterval(() => {
          setAnimatedTutorialText(tutorialText.slice(0, i + 1));
          i++;

          // Once the full text is shown...
          if (i === tutorialText.length) {
            // Turn off the typing animation
            clearInterval(intervalRef.current!);
            intervalRef.current = null;

            // Wait some time to show the full text, then trigger fade out
            animationTimeoutRef.current = setTimeout(() => {
              setFadeOut(true);
            }, 2500);
          }
        }, 80);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [showTutorialText, isButtonVisible]);

  return (
    <>
      <div className="app-mode z-20 fixed bottom-3 right-3 flex flex-row items-center gap-2">
        {/* Tutorial text */}
        {showTutorialText &&
          isButtonVisible &&
          animatedTutorialText.length > 0 && (
            <Fade
              isFading={fadeOut}
              fadeType="out"
              duration={fadeOutDuration}
              onFadeComplete={() => setShowTutorialText(false)}
              className="bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full pointer-events-none"
              aria-live="polite"
            >
              {animatedTutorialText}
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
