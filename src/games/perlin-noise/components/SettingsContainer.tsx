"use client";

import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const openWindow = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(true);
    dispatchMenuEvent("Settings", "open");
  };

  const closeWindow = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(false);
    dispatchMenuEvent("Settings", "close");
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsButtonVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsButtonVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, []);

  return (
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Settings"
        className={`fixed bottom-3 left-3 ${isButtonVisible ? "" : "hidden"}`}
        title="Settings"
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full" id="perlin-noise-settings-container">
          {/* Top Section: Settings Info */}
          <div
            className="p-2 flex flex-col items-center"
            id="perlin-noise-settings-description"
          >
            <h1 className="text-center">Settings</h1>
            <p className="text-center">FIXME... add settings</p>
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
