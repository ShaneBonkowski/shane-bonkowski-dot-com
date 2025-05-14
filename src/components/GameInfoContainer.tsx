"use client";

import React, { useState, useEffect } from "react";
import InfoButton from "@/src/components/InfoButton";
import GameInfoWindow from "@/src/components/GameInfoWindow";
import { ContentDataProps } from "@/src/types/data-props";
import { dispatchMenuEvent } from "@/src/events/game-events";

const GameInfoContainer: React.FC<{ infoData: ContentDataProps[] }> = ({
  infoData,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const openInfoWindow = () => {
    setIsVisible(true);
    dispatchMenuEvent("Info", "open");
  };

  const closeInfoWindow = () => {
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

  return (
    <>
      {isButtonVisible && <InfoButton onPointerDown={openInfoWindow} />}
      <GameInfoWindow
        isVisible={isVisible}
        onClose={closeInfoWindow}
        infoData={infoData}
      ></GameInfoWindow>
    </>
  );
};

export default GameInfoContainer;
