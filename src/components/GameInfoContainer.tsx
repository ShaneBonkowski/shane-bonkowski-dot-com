"use client";

import React, { useState } from "react";
import InfoButton from "@/src/components/InfoButton";
import InfoWindow from "@/src/components/InfoWindow";
import { ContentDataProps } from "@/src/types/data-props";
import { dispatchMenuEvent } from "@/src/events/game-events";

const GameInfoContainer: React.FC<{ infoData: ContentDataProps[] }> = ({
  infoData,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openInfoWindow = () => {
    setIsVisible(true);
    dispatchMenuEvent("Info", "open");
  };

  const closeInfoWindow = () => {
    setIsVisible(false);
    dispatchMenuEvent("Info", "close");
  };

  return (
    <>
      <InfoButton onClick={openInfoWindow} />
      <InfoWindow
        isVisible={isVisible}
        onClose={closeInfoWindow}
        infoData={infoData}
      ></InfoWindow>
    </>
  );
};

export default GameInfoContainer;
