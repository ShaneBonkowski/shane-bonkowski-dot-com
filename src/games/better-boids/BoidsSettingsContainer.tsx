"use client";

import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";

const BoidsSettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const openWindow = () => {
    setIsVisible(true);
    dispatchMenuEvent("Info", "open");
  };

  const closeWindow = () => {
    setIsVisible(false);
    dispatchMenuEvent("Info", "close");
  };

  return (
    <>
      <GameIconButton
        onClick={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Boid Settings"
        className="fixed bottom-5 left-5"
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div>Placeholder text...</div>
      </GameUiWindow>
    </>
  );
};

export default BoidsSettingsContainer;
