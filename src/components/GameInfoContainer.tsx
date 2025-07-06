"use client";

import React, { useState, useEffect, useRef } from "react";
import GameIconButton from "@/src/components/GameIconButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { FaInfoCircle } from "react-icons/fa";

const GameInfoContainer: React.FC<{
  lightModeDark?: boolean;
  darkModeLight?: boolean;
  whiteBackground?: boolean;
  children: React.ReactNode;
}> = ({
  lightModeDark = false,
  darkModeLight = false,
  whiteBackground = false,
  children,
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

  const openInfoWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
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

              // match css fade anim duration defined below, after which
              // we will hide the text fully by setting showTutorialText to false
              animationTimeoutRef.current = setTimeout(
                () => setShowTutorialText(false),
                500
              );
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
      <div className="z-20 fixed bottom-3 right-3 flex flex-row items-center gap-2">
        {/* Tutorial text */}
        {showTutorialText &&
          isButtonVisible &&
          animatedTutorialText.length > 0 && (
            <div
              className={`bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full pointer-events-none transition-opacity duration-500 ${
                fadeOut ? "opacity-0" : "opacity-100"
              }`}
              aria-live="polite"
            >
              {animatedTutorialText}
            </div>
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
