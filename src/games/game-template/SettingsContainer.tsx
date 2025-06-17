"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    dispatchMenuEvent("Settings", "open");
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);

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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="<GAME-NAME> Settings" // FIXME: Replace with actual game name
        className={`fixed bottom-5 left-5 ${isButtonVisible ? "" : "hidden"}`}
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        {/* FIXME: Replace id with actual game name */}
        <div className="w-full h-full p-4" id="<GAME-NAME>-settings-container">
          {/* Top Section: Settings Info */}
          {/* FIXME: Replace id with actual game name */}
          <div className="p-2" id="<GAME-NAME>-settings-description">
            <div className="flex flex-col items-center">
              <h1 className="text-center my-0">Settings</h1>
              <p className="text-center mb-0">FIXME... add settings</p>
            </div>
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
