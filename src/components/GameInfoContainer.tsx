"use client";

import React, { useState, useEffect, useRef } from "react";
import GameIconButton from "@/src/components/GameIconButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { ContentDataProps } from "@/src/types/data-props";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { FaInfoCircle } from "react-icons/fa";

const GameInfoContainer: React.FC<{
  infoData: ContentDataProps[];
  lightModeDark?: boolean;
  darkModeLight?: boolean;
  whiteBackground?: boolean;
}> = ({
  infoData,
  lightModeDark = false,
  darkModeLight = false,
  whiteBackground = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openInfoWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
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

  return (
    <>
      <GameIconButton
        onPointerDown={openInfoWindow}
        icon={<FaInfoCircle size={30} />}
        ariaLabel="Game Information"
        className={`fixed bottom-5 right-5 ${isButtonVisible ? "" : "hidden"}`}
        lightModeDark={lightModeDark}
        darkModeLight={darkModeLight}
        whiteBackground={whiteBackground}
        title="Game Information"
      />
      <GameInfoWindow
        isVisible={isVisible}
        onClose={closeInfoWindow}
        infoData={infoData}
        aria-label="Game information window"
      ></GameInfoWindow>
    </>
  );
};

export default GameInfoContainer;
