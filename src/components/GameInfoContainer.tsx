"use client";

import React, { useState, useEffect, useRef } from "react";
import InfoButton from "@/src/components/InfoButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { ContentDataProps } from "@/src/types/data-props";
import { dispatchMenuEvent } from "@/src/events/game-events";

const GameInfoContainer: React.FC<{ infoData: ContentDataProps[] }> = ({
  infoData,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openInfoWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    dispatchMenuEvent("Info", "open");
  };

  const closeInfoWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);

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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {isButtonVisible && (
        <InfoButton
          onPointerDown={openInfoWindow}
          aria-label="Open information window"
        />
      )}
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
